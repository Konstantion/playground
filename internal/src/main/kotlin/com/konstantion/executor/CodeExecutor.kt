package com.konstantion.executor

import com.konstantion.interpreter.InterpreterIssue
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.TaskId
import com.konstantion.utils.Either
import java.io.IOException

interface CodeExecutor<Id, L> : AutoCloseable where Id : Any, L : Lang {
  fun <O> submit(
    groupId: Id,
    code: Code<L, O>,
    callArgs: List<PlaceholderLabel>,
    placeholderValues: Map<PlaceholderIdentifier, PlaceholderValue>,
  ): Task<O> where O : Code.Output

  fun subscribe(
    groupId: Id,
    listener: Listener<Id>,
  )

  fun unsubscribe(
    groupId: Id,
    listener: Listener<Id>,
  )

  interface Task<O> where O : Code.Output {
    fun id(): TaskId

    fun outputType(): Class<O>

    @Throws(InterruptedException::class) fun get(): Either<Issue, O>
  }

  interface Listener<Id> where Id : Any {
    fun onSuccess(
      groupId: Id,
      taskId: TaskId,
      output: Code.Output,
    )

    fun onError(
      groupId: Id,
      taskId: TaskId,
      issue: Issue,
    )
  }

  sealed interface Issue {
    data class Interpretation(
      val cause: InterpreterIssue,
    ) : Issue

    data class Unknown(
      val description: String,
      val reason: Throwable? = null,
    ) : Issue

    data class Io(
      val cause: IOException,
    ) : Issue

    data class Parse(
      val description: String,
    ) : Issue

    data class UnexpectedCode(
      val code: Int,
      val stderr: String? = null,
    ) : Issue

    data object Killed : Issue

    data object MemoryViolation : Issue

    data object CpuTimeExceeded : Issue

    data object Canceled : Issue
  }
}
