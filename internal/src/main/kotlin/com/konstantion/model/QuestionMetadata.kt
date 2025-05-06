package com.konstantion.model

import java.util.UUID

data class QuestionMetadata(
  val questionIdentifier: UUID,
  val text: String,
  val formatAndCode: FormatAndCode,
  val correctAnswers: List<Answer>,
  val incorrectAnswers: List<Answer>,
) {
  fun answers(): List<Answer> = correctAnswers + incorrectAnswers
}

data class Answer(val variantIdentifier: UUID, val text: String, val executorTaskId: TaskId)
