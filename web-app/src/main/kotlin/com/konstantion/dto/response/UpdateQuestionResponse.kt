package com.konstantion.dto.response

data class UpdateQuestionResponse(
  val violations: Map<String, List<String>>,
  val updated: QuestionResponse,
)
