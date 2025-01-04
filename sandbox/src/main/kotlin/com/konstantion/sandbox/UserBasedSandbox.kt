package com.konstantion.sandbox

import com.konstantion.Logs
import com.konstantion.interpreter.CodeInterpreter
import com.konstantion.lang.Unreachable
import com.konstantion.model.Code
import com.konstantion.model.Code.ReturnType
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.service.CodeExecutor
import com.konstantion.service.CodeExecutor.Issue
import com.konstantion.service.CodeExecutor.Listener
import com.konstantion.service.CodeExecutor.Task
import com.konstantion.service.Output
import com.konstantion.service.TaskId
import com.konstantion.utils.CmdHelper
import com.konstantion.utils.Either
import com.konstantion.utils.IdGenerator
import com.konstantion.utils.schedule
import java.io.IOException
import java.time.Duration
import java.util.LinkedList
import java.util.concurrent.CancellationException
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutionException
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.stream.Collectors
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
  private val listeners: MutableMap<GroupId, MutableSet<Listener<GroupId, *>>> = ConcurrentHashMap()
  private val tasks: MutableMap<GroupId, MutableSet<Task<*>>> = ConcurrentHashMap()
  private val scheduler: ScheduledExecutorService =
    Executors.newScheduledThreadPool(SCHEDULER_POOL_SIZE)
  private val taskIdGen: IdGenerator<TaskId> =
    IdGenerator.AtomicLong(System.currentTimeMillis()).andThen(::TaskId)

  override fun <R : ReturnType> submit(
    groupId: GroupId,
    code: Code<L, R>,
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Task<R> {
    val taskId: TaskId = taskIdGen.nextId()

    return when (
      val result = interpreter.toExecutableCode(code, callArgs, placeholderDefinitions)
    ) {
      is Either.Left -> {
        val issue = Issue.Interpretation(result.value)

        notifyListenersOfError(groupId, taskId, issue, code.returnType())

        object : Task<R> {
          override fun id(): TaskId = taskId

          override fun returnType(): R = code.returnType()

          override fun get(): Either<Issue, Output> = Either.Left(issue)
        }
      }
      is Either.Right -> {
        val cmd: List<String> = cmdHelper.create(result.value)

        val task: CompletableFuture<Either<Issue, Output>> =
          CompletableFuture.supplyAsync<Either<Issue, Output>>(
              {
                try {
                  val process: Process = ProcessBuilder(cmd).inheritIO().start()
                  val exitCode = process.waitFor()
                  if (exitCode != 0) {
                    return@supplyAsync Either.left(Issue.UnexpectedCode(exitCode))
                  }

                  val output = process.inputReader().lines().collect(Collectors.joining())
                  Either.right(Output(output))
                } catch (_: InterruptedException) {
                  Either.left(Issue.Canceled)
                } catch (ioError: IOException) {
                  Either.left(Issue.Io(ioError))
                }
              },
              executor
            )
            .whenComplete { taskResult, error ->
              if (error != null) {
                notifyListenersOfError(
                  groupId,
                  taskId,
                  Issue.Unknown("Unhandled exception", error),
                  code.returnType()
                )
              } else {
                when (taskResult) {
                  is Either.Left -> {
                    notifyListenersOfError(groupId, taskId, taskResult.value, code.returnType())
                  }
                  is Either.Right -> {
                    notifyListenersOfSuccess(groupId, taskId, taskResult.value, code.returnType())
                  }
                }
              }
            }

        val wrapped =
          object : Task<R> {
            override fun id(): TaskId = taskId

            override fun returnType(): R = code.returnType()

            override fun get(): Either<Issue, Output> {
              return try {
                task.get()
              } catch (_: CancellationException) {
                Either.left(Issue.Canceled)
              } catch (executionError: ExecutionException) {
                throw Unreachable("Task shouldn't fail on unknown error.", executionError)
              }
            }
          }

        scheduler.schedule(config.executionTime) { task.cancel(true) }

        tasks(groupId) += wrapped
        return wrapped
      }
    }
  }

  override fun <R : ReturnType> subscribe(groupId: GroupId, listener: Listener<GroupId, R>) {
    listeners(groupId) += listener
  }

  override fun unsubscribe(groupId: GroupId, listener: Listener<GroupId, *>) {
    listeners(groupId) -= listener
  }

  private fun <R> notifyListenersOfError(
    groupId: GroupId,
    taskId: TaskId,
    issue: Issue,
    returnType: R,
  ) where R : ReturnType {
    scheduler.schedule(
      NOTIFICATION_DELAY,
    ) {
      val groupListeners = listeners[groupId] ?: return@schedule
      for (listener in groupListeners) {
        if (listener.returnType() == returnType) {
          listener.onError(groupId, taskId, issue)
        }
      }
    }
  }

  private fun <R> notifyListenersOfSuccess(
    groupId: GroupId,
    taskId: TaskId,
    output: Output,
    returnType: R,
  ) where R : ReturnType {
    scheduler.schedule(
      NOTIFICATION_DELAY,
    ) {
      val groupListeners = listeners[groupId] ?: return@schedule
      for (listener in groupListeners) {
        if (listener.returnType() == returnType) {
          listener.onSuccess(groupId, taskId, output)
        }
      }
    }
  }

  private fun listeners(groupId: GroupId): MutableSet<Listener<GroupId, *>> =
    listeners.computeIfAbsent(groupId) { ConcurrentHashMap.newKeySet() }

  private fun tasks(groupId: GroupId): MutableSet<Task<*>> =
    tasks.computeIfAbsent(groupId) { ConcurrentHashMap.newKeySet() }

  override fun toString(): String {
    return "UserBasedSandbox[username=$username]"
  }
}
