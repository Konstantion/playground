package com.konstantion.dto.response

import com.konstantion.dto.response.AnswerResponse.Companion.asResponse
import com.konstantion.entity.AnswerEntity
import com.konstantion.entity.UserQuestionAnswerEntity
import java.util.UUID

data class QuestionAnswerResponse(
  val id: UUID,
  val questionId: UUID,
  val questionMetadataId: UUID,
  val answers: List<AnswerResponse>,
) {
  companion object {
    fun UserQuestionAnswerEntity.asResponse(): QuestionAnswerResponse =
      QuestionAnswerResponse(
        id = id(),
        questionId = question().question().id(),
        answers = answers().map { answer -> answer.asResponse() },
        questionMetadataId = question().id(),
      )
  }
}

data class AnswerResponse(
  val id: UUID,
  val questionId: UUID,
  val variantId: UUID,
  val answer: String,
) {
  companion object {
    fun AnswerEntity.asResponse(): AnswerResponse =
      AnswerResponse(
        id = id(),
        questionId = question().id(),
        answer = answer(),
        variantId = variant().id(),
      )
  }
}
