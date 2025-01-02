package com.konstantion.service

import com.konstantion.Either
import com.konstantion.model.*
import java.util.*
import kotlin.jvm.Throws

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
    fun id(): Long

    @Throws(InterruptedException::class) fun get(): Either<Issue, R>
  }

  interface Listener<Id, R> where Id : Any, R : Code.ReturnType {
    fun onSuccess(groupId: Id, taskId: Long, success: R)

    fun onError(groupId: Id, taskId: Long, issue: Issue)
  }

  sealed interface Issue {
    data class Unknown(val description: String, val reason: Throwable? = null) : Issue
  }
}
