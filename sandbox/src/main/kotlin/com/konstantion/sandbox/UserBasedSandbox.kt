package com.konstantion.sandbox

import com.konstantion.Logs
import com.konstantion.interpreter.CodeInterpreter
import com.konstantion.lang.Unreachable
import com.konstantion.model.Code
import com.konstantion.model.Code.Output
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.service.CodeExecutor
import com.konstantion.service.CodeExecutor.Issue
import com.konstantion.service.CodeExecutor.Listener
import com.konstantion.service.CodeExecutor.Task
import com.konstantion.service.TaskId
import com.konstantion.utils.CmdHelper
import com.konstantion.utils.Either
import com.konstantion.utils.IdGenerator
import com.konstantion.utils.schedule
import com.konstantion.utils.shrink
import java.io.IOException
import java.time.Duration
import java.util.LinkedList
import java.util.concurrent.Callable
import java.util.concurrent.CancellationException
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutionException
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledFuture
import org.slf4j.Logger

@JvmInline value class GroupId(val value: Long)

private val NOTIFICATION_DELAY: Duration = Duration.ofMillis(5)
private const val SCHEDULER_POOL_SIZE: Int = 2

class UserBasedSandbox<L>(
  logs: Logs,
  private val username: String,
  private val cmdHelper: CmdHelper<L>,
  private val interpreter: CodeInterpreter<L>,
  private val config: SandboxConfig = SandboxConfig.DEFAULT,
  private val executor: ExecutorService = Executors.newSingleThreadExecutor(),
) : CodeExecutor<GroupId, L> where L : Lang {
  private val log: Logger = logs.forService(javaClass)
  private val listenersHelper: ListenersHelper<GroupId> = ListenersHelper()
  private val tasks: MutableMap<GroupId, MutableSet<Task<*>>> = ConcurrentHashMap()
  private val scheduler: ScheduledExecutorService =
    Executors.newScheduledThreadPool(SCHEDULER_POOL_SIZE)
  private val taskIdGen: IdGenerator<TaskId> =
    IdGenerator.AtomicLong(System.currentTimeMillis()).andThen(::TaskId)

  override fun <O : Output> submit(
    groupId: GroupId,
    code: Code<L, O>,
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Task<O> {
    val taskId: TaskId = taskIdGen.nextId()

    log.debug("Processing groupId={}, taskId={}, code={}.", groupId, taskId, code.code().shrink())

    return when (
      val result = interpreter.toExecutableCode(code, callArgs, placeholderDefinitions)
    ) {
      is Either.Left -> {
        val issue = Issue.Interpretation(result.value)
        log.debug("Failed to interpret taskId={}, issue={}. Notifying listeners.", taskId, issue)

        notifyListenersOfError(groupId, taskId, issue)

        object : Task<O> {
          override fun id(): TaskId = taskId

          override fun outputType(): Class<O> = code.outputType()

          override fun get(): Either<Issue, O> = Either.Left(issue)
        }
      }
      is Either.Right -> {
        val cmd: List<String> = cmdHelper.create(result.value)

        log.debug("Submitting to executor taskId={}, cmd={}.", taskId, cmd.joinToString().shrink())

        val cancelerTask =
          object {
            var deref: ScheduledFuture<*>? = null
          }
        val task: Future<Either<Issue, O>> =
          executor.submit(
            Callable {
              var process: Process? = null
              val taskResult: Either<Issue, O> =
                try {
                  process = ProcessBuilder(cmd).start()
                  val exitCode = process.waitFor()
                  if (exitCode != 0) {
                    log.debug("Process for taskId={} exited with unexpected code={}.", taskId, code)
                    Either.left(Issue.UnexpectedCode(exitCode))
                  } else {
                    val output = process.inputReader().lines().toList()
                    log.debug(
                      "Process for taskId={}, successfully finished, output={}.",
                      taskId,
                      output.joinToString().shrink()
                    )
                    Either.right(Output.Parser.parse(code.outputType(), output))
                  }
                } catch (_: InterruptedException) {
                  log.debug("Task groupId={}, taskId={} was interrupted.", groupId, taskId)
                  process?.destroyForcibly()
                  Either.left(Issue.Canceled)
                } catch (ioError: IOException) {
                  log
                    .atDebug()
                    .setCause(ioError)
                    .log("Unexpected io error during process execution for taskId={}.", taskId)
                  Either.left(Issue.Io(ioError))
                } catch (unexpectedError: Exception) {
                  Either.left(Issue.Unknown("Unexpected error", unexpectedError))
                } finally {
                  log.debug("Destroying process for groupId={}, taskId={}.", groupId, taskId)
                  process?.destroy()
                }

              log.debug(
                "Task completed groupId={}, taskId={}, taskResult={}",
                groupId,
                taskId,
                taskResult,
              )
              cancelerTask.deref?.cancel(true)
              when (taskResult) {
                is Either.Left -> {
                  notifyListenersOfError(groupId, taskId, taskResult.value)
                }
                is Either.Right -> {
                  notifyListenersOfSuccess(groupId, taskId, taskResult.value)
                }
              }
              taskResult
            }
          )

        val wrapped =
          object : Task<O> {
            override fun id(): TaskId = taskId

            override fun outputType(): Class<O> = code.outputType()

            override fun get(): Either<Issue, O> {
              return try {
                task.get()
              } catch (_: CancellationException) {
                Either.left(Issue.Canceled)
              } catch (executionError: ExecutionException) {
                throw Unreachable("Task shouldn't fail on unknown error.", executionError)
              }
            }
          }

        cancelerTask.deref =
          scheduler.schedule(config.executionTime) {
            log.debug("Canceling taskId={}, because of timeout.", taskId)
            task.cancel(true)
          }

        tasks(groupId) += wrapped
        return wrapped
      }
    }
  }

  override fun subscribe(groupId: GroupId, listener: Listener<GroupId>) {
    listenersHelper += groupId to listener
  }

  override fun unsubscribe(groupId: GroupId, listener: Listener<GroupId>) {
    listenersHelper -= groupId to listener
  }

  private fun notifyListenersOfError(
    groupId: GroupId,
    taskId: TaskId,
    issue: Issue,
  ) {
    scheduler.schedule(
      NOTIFICATION_DELAY,
    ) {
      for (listener in listenersHelper.listeners(groupId)) {
        listener.onError(groupId, taskId, issue)
      }
    }
  }

  private fun notifyListenersOfSuccess(
    groupId: GroupId,
    taskId: TaskId,
    output: Output,
  ) {
    scheduler.schedule(
      NOTIFICATION_DELAY,
    ) {
      for (listener in listenersHelper.listeners(groupId)) {
        listener.onSuccess(groupId, taskId, output)
      }
    }
  }

  private fun tasks(groupId: GroupId): MutableSet<Task<*>> =
    tasks.computeIfAbsent(groupId) { ConcurrentHashMap.newKeySet() }

  override fun toString(): String {
    return "UserBasedSandbox[username=$username]"
  }
}
