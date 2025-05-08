package com.konstantion.service

import com.konstantion.utils.Either

interface ServiceIssue {
  fun code(): Int

  fun message(): String
}

data class UnexpectedAction(
  val action: String,
) : ServiceIssue {
  override fun code(): Int = 400

  override fun message(): String = "Unexpected action: $action"
}

data class TokenExpired(
  val message: String,
) : ServiceIssue {
  override fun code(): Int = 401

  override fun message(): String = message
}

data class SqlError(
  val message: String,
) : ServiceIssue {
  override fun code(): Int = 500

  override fun message(): String = message
}

data class Forbidden(
  val message: String,
) : ServiceIssue {
  companion object {
    fun <R : Any> asEither(message: String): Either<ServiceIssue, R> =
      Either.left(Forbidden(message))
  }

  override fun code(): Int = 403

  override fun message(): String = message
}
