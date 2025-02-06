package com.konstantion.model

import java.util.UUID

data class QuestionMetadata(
  val formatAndCode: FormatAndCode,
  val correctAnswers: List<Answer>,
  val intersectAnswer: List<Answer>,
)

data class Answer(val identifier: UUID, val text: String, val executorTaskId: TaskId)
