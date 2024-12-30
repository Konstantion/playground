package com.konstantion.sandbox

import com.konstantion.Logs
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.service.CodeExecutor
import org.slf4j.Logger

class RestrictedUserSandbox<L>(logs: Logs, private val username: String) :
  CodeExecutor<Long, L> where L : Lang {
  private val log: Logger = logs.forService(javaClass)

  override fun <R : Code.ReturnType> submit(groupId: Long, code: Code<L, R>): CodeExecutor.Task<R> {
    TODO("Not yet implemented")
  }

  override fun <R : Code.ReturnType> subscribe(
    groupId: Long,
    listener: CodeExecutor.Listener<Long, R>
  ) {
    TODO("Not yet implemented")
  }

  override fun unsubscribe(groupId: Long, listener: CodeExecutor.Listener<Long, *>) {
    TODO("Not yet implemented")
  }

  override fun toString(): String {
    return "RestrictedUserSandbox[username=$username]"
  }
}
