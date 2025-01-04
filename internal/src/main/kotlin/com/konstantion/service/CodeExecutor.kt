package com.konstantion.service

import com.konstantion.interpreter.InterpreterIssue
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.utils.Either
import java.io.IOException
import java.util.LinkedList

@JvmInline value class TaskId(val value: Long)

@JvmInline value class Output(val value: String)

interface CodeExecutor<Id, L> where Id : Any, L : Lang {
  fun <R> submit(
    groupId: Id,
    code: Code<L, R>,
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Task<R> where R : Code.ReturnType

  fun <R> subscribe(groupId: Id, listener: Listener<Id, R>) where R : Code.ReturnType

  fun unsubscribe(groupId: Id, listener: Listener<Id, *>)

  interface Task<R> where R : Code.ReturnType {
    fun id(): TaskId

    fun returnType(): R

    @Throws(InterruptedException::class) fun get(): Either<Issue, Output>
  }

  interface Listener<Id, R> where Id : Any, R : Code.ReturnType {
    fun onSuccess(groupId: Id, taskId: TaskId, success: Output)

    fun onError(groupId: Id, taskId: TaskId, issue: Issue)

    fun returnType(): R
  }

  sealed interface Issue {
    data class Interpretation(val cause: InterpreterIssue) : Issue
    data class Unknown(val description: String, val reason: Throwable? = null) : Issue
    data class Io(val cause: IOException) : Issue
    data class UnexpectedCode(val code: Int) : Issue
    data object Canceled : Issue
  }
}
