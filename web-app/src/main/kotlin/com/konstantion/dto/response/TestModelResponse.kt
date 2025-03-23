package com.konstantion.dto.response

import com.konstantion.dto.response.QuestionResponse.Companion.asResponse
import com.konstantion.entity.TestModelEntity
import java.util.UUID

data class TestModelResponse(
  val id: UUID,
  val name: String,
  val questions: List<QuestionResponse>,
) {
  companion object {
    fun TestModelEntity.asResponse() =
      TestModelResponse(id = id(), name = name(), questions = questions.asResponse())
  }
}
