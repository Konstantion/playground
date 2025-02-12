package com.konstantion.service

import com.konstantion.utils.Either

data class SqlError(val message: String) : QuestionService.Issue

data class Forbidden(val message: String) : QuestionService.Issue {
  companion object {
    fun <R : Any> asEither(message: String): Either<QuestionService.Issue, R> {
      return Either.left(Forbidden(message))
    }
  }
}
