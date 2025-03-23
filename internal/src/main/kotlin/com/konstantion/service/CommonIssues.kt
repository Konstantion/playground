package com.konstantion.service

import com.konstantion.utils.Either

interface ServiceIssue {
  fun code(): Int
  fun message(): String

}

data class SqlError(val message: String) : ServiceIssue {
  override fun code(): Int {
    return 500
  }

  override fun message(): String {
    return message
  }
}

data class Forbidden(val message: String) : ServiceIssue {
  companion object {
    fun <R : Any> asEither(message: String): Either<ServiceIssue, R> {
      return Either.left(Forbidden(message))
    }
  }

  override fun code(): Int {
    return 403
  }

  override fun message(): String {
    return message
  }
}
