package com.konstantion.sandbox

import com.konstantion.Either
import com.konstantion.Logs
import com.konstantion.interpreter.CodeInterpreter
import com.konstantion.interpreter.GeneratorIssue
import com.konstantion.model.*
import com.konstantion.service.CodeExecutor
import com.konstantion.service.CodeExecutor.*
import com.konstantion.utils.CmdHelper
import com.konstantion.utils.IdGenerator
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import org.slf4j.Logger

class UserBasedSandbox<L>(
  logs: Logs,
  private val username: String,
  private val cmdHelper: CmdHelper<L>,
  private val interpreter: CodeInterpreter<L>,
  private val config: SandboxConfig = SandboxConfig.DEFAULT,
  private val executor: ExecutorService = Executors.newSingleThreadExecutor(),
) : CodeExecutor<Long, L> where L : Lang {
  private val log: Logger = logs.forService(javaClass)
  private val listeners: MutableMap<Long, MutableSet<Listener<Long, *>>> = ConcurrentHashMap()
  private val tasks: MutableMap<Long, MutableSet<Task<*>>> = ConcurrentHashMap()
  private val canceler: ScheduledExecutorService = Executors.newSingleThreadScheduledExecutor()
  private val taskIdGenerator: IdGenerator<Long> = IdGenerator.AtomicLong()

  override fun <R : Code.ReturnType> submit(
    groupId: Long,
    code: Code<L, R>,
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Task<R> {
    val taskId: Long = taskIdGenerator.nextId()
    return when (
      val result = interpreter.toExecutableCode(code, callArgs, placeholderDefinitions)
    ) {
      is Either.Left<GeneratorIssue, *> -> {
        val issue = Issue.Unknown(result.value.toString())

        listeners(groupId).forEach { listener -> listener.onError(groupId, taskId, issue) }

        object : Task<R> {
          override fun id(): Long = taskId

          override fun get(): Either<Issue, R> = Either.Left(issue)
        }
      }
      is Either.Right<*, String> -> TODO()
    }
  }

  override fun <R : Code.ReturnType> subscribe(groupId: Long, listener: Listener<Long, R>) {
    TODO("Not yet implemented")
  }

  override fun unsubscribe(groupId: Long, listener: Listener<Long, *>) {
    TODO("Not yet implemented")
  }

  override fun toString(): String {
    return "RestrictedUserSandbox[username=$username]"
  }

  private fun listeners(groupId: Long): Set<Listener<Long, *>> =
    listeners.computeIfAbsent(groupId) { ConcurrentHashMap.newKeySet() }
}
