package com.konstantion.executor

import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.QuestionMetadata
import com.konstantion.model.TaskId
import com.konstantion.utils.Either

interface QuestionExecutor<L> : AutoCloseable where L : Lang {
  fun submit(question: Question<L>): Task

  @Throws(InterruptedException::class)
  fun run(question: Question<L>): Either<Issue, QuestionMetadata>

  sealed interface Issue {
    data class Multiple(
      val issues: List<Issue>,
    ) : Issue

    data class VariantExecution(
      val variant: Question.Variant<*>,
      val underlying: CodeExecutor.Issue,
    ) : Issue
  }

  interface Task {
    fun id(): TaskId

    @Throws(InterruptedException::class) fun get(): Either<Issue, QuestionMetadata>
  }
}
