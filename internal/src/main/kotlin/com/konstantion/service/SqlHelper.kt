package com.konstantion.service

import com.konstantion.port.Port
import com.konstantion.utils.Either
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.Lock
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

object SqlHelper {
  private val sqlLocks: MutableMap<Port, ReentrantLock> = ConcurrentHashMap()

  fun <P : Port, T : Any> P.sqlAction(action: P.() -> T): Either<ServiceIssue, T> {
    val sqlLock: Lock = sqlLocks.computeIfAbsent(this) { ReentrantLock() }
    return sqlLock.withLock {
      try {
        Either.right(action())
      } catch (dbIssue: Exception) {
        Either.left(SqlError(dbIssue.message ?: "Unknown error"))
      }
    }
  }
}
