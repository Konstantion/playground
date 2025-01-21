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
import com.konstantion.model.TaskId
import com.konstantion.service.CodeExecutor
import com.konstantion.service.CodeExecutor.Issue
import com.konstantion.service.CodeExecutor.Listener
import com.konstantion.service.CodeExecutor.Task
import com.konstantion.storage.FileType
import com.konstantion.storage.TempFileStorage
import com.konstantion.utils.CmdHelper
import com.konstantion.utils.Either
import com.konstantion.utils.IdGenerator
import com.konstantion.utils.UlimitHelper
import com.konstantion.utils.UlimitHelper.ExitCode
import com.konstantion.utils.closeForcefully
import com.konstantion.utils.schedule
import com.konstantion.utils.shrink
import java.io.IOException
import java.nio.file.Path
import java.time.Duration
import java.util.concurrent.Callable
import java.util.concurrent.CancellationException
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutionException
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledFuture
import java.util.stream.Collectors
import org.slf4j.Logger

@JvmInline value class GroupId(val value: Long)

private val NOTIFICATION_DELAY: Duration = Duration.ofMillis(5)
private val CPU_TIME_THRESHOLD: Duration = Duration.ofMillis(30)
private val EXTERNAL_SHUTDOWN_TIMEOUT: Duration = Duration.ofSeconds(30)
private const val SCHEDULER_POOL_SIZE: Int = 2

class UserBasedSandbox<L>(
  logs: Logs,
  private val lang: L,
  private val username: String,
  private val cmdHelper: CmdHelper<L>,
  private val interpreter: CodeInterpreter<L>,
  private val config: SandboxConfig = SandboxConfig.DEFAULT,
  private val executor: ExecutorService =
    Executors.newCachedThreadPool(Thread.ofPlatform().name("user-based-executor-", 0).factory()),
) : CodeExecutor<GroupId, L> where L : Lang {
  private val log: Logger = logs.forService(javaClass)
  private val fileStorage: TempFileStorage<TaskId> =
    TempFileStorage("user_based_sandbox_${username}_$lang")
  private val listenersHelper: ListenersHelper<GroupId> =
    ListenersHelper.withGlobal(
      object : Listener<GroupId> {
        override fun onSuccess(groupId: GroupId, taskId: TaskId, output: Output) {
          fileStorage.scheduleDeletion(taskId, FileType.of(lang))
        }

        override fun onError(groupId: GroupId, taskId: TaskId, issue: Issue) {}
      }
    )
  private val tasks: MutableMap<GroupId, MutableSet<Task<*>>> = ConcurrentHashMap()
  private val shutdownAfter: Duration = config.cpuTime.plus(EXTERNAL_SHUTDOWN_TIMEOUT)
  private val scheduler: ScheduledExecutorService =
    Executors.newScheduledThreadPool(
      SCHEDULER_POOL_SIZE,
      Thread.ofPlatform().name("user-based-scheduler-", 0).factory()
    )
  private val taskIdGen: IdGenerator<TaskId> =
    IdGenerator.AtomicLong(System.currentTimeMillis()).andThen(::TaskId)

  override fun <O : Output> submit(
    groupId: GroupId,
    code: Code<L, O>,
    callArgs: List<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Task<O> {
    val taskId: TaskId = taskIdGen.nextId()

    log.debug("Processing groupId={}, taskId={}, code={}.", groupId, taskId, code.code.shrink())

    return when (
      val result = interpreter.toExecutableCode(code, callArgs, placeholderDefinitions)
    ) {
      is Either.Left -> {
        val issue = Issue.Interpretation(result.value)
        log.debug("Failed to interpret taskId={}, issue={}. Notifying listeners.", taskId, issue)

        notifyListenersOfError(groupId, taskId, issue)

        failedTask(taskId, issue, code.outputType)
      }
      is Either.Right -> {
        val path: Path =
          when (val fileResult = fileStorage.save(taskId, result.value, FileType.of(lang))) {
            is Either.Left -> {
              val issue = Issue.Io(fileResult.value)
              log.debug(
                "Failed to write code to file taskId={}, issue={}. Notifying listeners.",
                taskId,
                issue
              )
              notifyListenersOfError(groupId, taskId, issue)
              return failedTask(taskId, issue, code.outputType)
            }
            is Either.Right -> fileResult.value
          }

        val cmd = withLimitations(cmdHelper.build(path.toAbsolutePath().toString()))
        log.debug("Submitting to executor taskId={}, path={}, cmd={}.", taskId, path, cmd)

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
                  val start: Long = System.nanoTime()
                  val exitCode = process.waitFor()
                  if (exitCode != 0) {
                    log.debug(
                      "Process for taskId={} exited with unexpected code={}.",
                      taskId,
                      exitCode
                    )
                    Either.left(parseIssue(exitCode, start, process))
                  } else {
                    val output = process.inputReader().lines().toList()
                    log.debug(
                      "Process for taskId={}, successfully finished, output={}.",
                      taskId,
                      output.joinToString().shrink()
                    )
                    Either.right(Output.Parser.parse(code.outputType, output))
                  }
                } catch (parseError: Output.ParserException) {
                  log.debug(
                    "Task groupId={}, taskId={}, failed to parse message={}.",
                    groupId,
                    taskId,
                    parseError.message
                  )
                  Either.left(Issue.Parse(parseError.message))
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

            override fun outputType(): Class<O> = code.outputType

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
          scheduler.schedule(shutdownAfter) {
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

  private fun withLimitations(cmd: List<String>): List<String> {
    val memoryKb = config.memoryLimitKb
    val cpuSeconds = config.cpuTime.toSeconds()
    check(cpuSeconds > 0) { "cpu seconds should be greater than 0." }

    val joinedCmd = cmd.joinToString(" ")

    val bashScript = buildString {
      append(UlimitHelper.memoryLimit(memoryKb))
      append(UlimitHelper.cpuTimeLimit(cpuSeconds))
      append(joinedCmd)
    }

    return listOf("bash", "-c", bashScript)
  }

  private fun tasks(groupId: GroupId): MutableSet<Task<*>> =
    tasks.computeIfAbsent(groupId) { ConcurrentHashMap.newKeySet() }

  private fun parseIssue(exitCode: Int, start: Long, process: Process): Issue {
    return when (ExitCode.parse(exitCode)) {
      ExitCode.SigCpu -> Issue.CpuTimeExceeded
      ExitCode.SigKill -> {
        val timePassed = Duration.ofNanos(System.nanoTime() - start)
        if (timePassed.plus(CPU_TIME_THRESHOLD) > config.cpuTime) {
          Issue.CpuTimeExceeded
        } else {
          Issue.Killed
        }
      }
      ExitCode.SigSegv -> Issue.MemoryViolation
      is ExitCode.Unknown -> {
        val stderr: String? =
          try {
            process.errorReader().lines().collect(Collectors.joining())
          } catch (_: IOException) {
            null
          }
        Issue.UnexpectedCode(exitCode, stderr)
      }
    }
  }

  private fun <O> failedTask(taskId: TaskId, issue: Issue, outputType: Class<O>): Task<O> where
  O : Output {
    return object : Task<O> {
      override fun id(): TaskId = taskId

      override fun outputType(): Class<O> = outputType

      override fun get(): Either<Issue, O> = Either.left(issue)
    }
  }

  override fun toString(): String {
    return "UserBasedSandbox[username=$username]"
  }

  override fun close() {
    executor.closeForcefully()
    scheduler.closeForcefully()
  }
}
