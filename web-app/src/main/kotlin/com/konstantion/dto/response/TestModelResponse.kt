package com.konstantion.dto.response

import com.konstantion.dto.response.QuestionResponse.Companion.asResponse
import com.konstantion.entity.TestModelEntity
import java.time.LocalDateTime
import java.util.UUID

data class TestModelResponse(
  val id: UUID,
  val name: String,
  val questions: List<QuestionResponse>,
  val createdAt: LocalDateTime,
  val creatorId: UUID? = null
) {
  companion object {
    fun TestModelEntity.asResponse() =
      TestModelResponse(
        id = id(),
        name = name(),
        questions = questions.asResponse(),
        createdAt = createdAt(),
        creatorId = creator?.id()
      )
  }
}
