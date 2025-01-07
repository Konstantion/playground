package com.konstantion.service

import com.konstantion.interpreter.InterpreterIssue
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.utils.Either
import java.io.IOException
import java.util.*

@JvmInline
value class TaskId(private val value: Long) {
  override fun toString(): String = value.toString()
}

interface CodeExecutor<Id, L> : AutoCloseable where Id : Any, L : Lang {
  fun <O> submit(
    groupId: Id,
    code: Code<L, O>,
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Task<O> where O : Code.Output

  fun subscribe(groupId: Id, listener: Listener<Id>)

  fun unsubscribe(groupId: Id, listener: Listener<Id>)

  interface Task<O> where O : Code.Output {
    fun id(): TaskId

    fun outputType(): Class<O>

    @Throws(InterruptedException::class) fun get(): Either<Issue, O>
  }

  interface Listener<Id> where Id : Any {
    fun onSuccess(groupId: Id, taskId: TaskId, output: Code.Output)

    fun onError(groupId: Id, taskId: TaskId, issue: Issue)
  }

  sealed interface Issue {
    data class Interpretation(val cause: InterpreterIssue) : Issue
    data class Unknown(val description: String, val reason: Throwable? = null) : Issue
    data class Io(val cause: IOException) : Issue
    data class UnexpectedCode(val code: Int, val stderr: String? = null) : Issue
    data object Killed : Issue
    data object MemoryViolation : Issue
    data object CpuTimeExceeded : Issue
    data object Canceled : Issue
  }
}
