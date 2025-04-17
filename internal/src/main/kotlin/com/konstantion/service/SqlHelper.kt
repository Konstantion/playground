package com.konstantion.service

import com.konstantion.port.Port
import com.konstantion.utils.Either
import java.util.Optional
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.Lock
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

object SqlHelper {
  private val lock : Lock = ReentrantLock()

  fun <P : Port, T : Any> P.sqlAction(action: P.() -> T): Either<ServiceIssue, T> {
    return lock.withLock {
      try {
        Either.right(action())
      } catch (dbIssue: Exception) {
        Either.left(SqlError(dbIssue.message ?: "Unknown error"))
      }
    }
  }

  fun <P: Port, T: Any>  P.slqOptionalAction(action: P.() -> Optional<T>) : Either<ServiceIssue, T> {
    return lock.withLock {
      try {
        val result = action()
        if (result.isPresent) {
          Either.right(result.orElseThrow())
        } else {
          Either.left(SqlError("No result found"))
        }
      } catch (dbIssue: Exception) {
        Either.left(SqlError(dbIssue.message ?: "Unknown error"))
      }
    }
  }
}
