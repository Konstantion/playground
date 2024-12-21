package com.konstantion

import kotlin.jvm.Throws

interface CodeExecutor<Id, L> where Id : Any, L : Lang {
  fun <R> submit(groupId: Id, code: Code<L, R>): Task<R> where R : Code.ReturnType

  fun <R> subscribe(groupId: Id, listener: Listener<Id, R>) where R : Code.ReturnType

  fun unsubscribe(groupId: Id, listener: Listener<Id, *>)

  interface Task<R> where R : Code.ReturnType {
    fun id(): Long

    @Throws(InterruptedException::class) fun get(): Either<Throwable, R>
  }

  interface Listener<Id, R> where Id : Any, R : Code.ReturnType {
    fun onSuccess(groupId: Id, taskId: Long, success: R)

    fun onError(groupId: Id, taskId: Long, error: Throwable)
  }
}
