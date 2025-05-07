package com.konstantion.dto.response

import com.konstantion.dto.common.FormatAndCodeDto
import com.konstantion.dto.response.AnswerResponse.Companion.asResponse
import com.konstantion.dto.response.QuestionMetadataResponse.Companion.asResponse
import com.konstantion.entity.QuestionMetadataEntity
import com.konstantion.entity.TestMetadataEntity
import com.konstantion.model.FormatAndCode
import java.util.UUID
import kotlinx.serialization.json.Json

data class TestMetadataResponse(
  val id: UUID,
  val testId: UUID,
  val name: String,
  val questionMetadata: List<QuestionMetadataResponse>,
) {
  companion object {
    fun TestMetadataEntity.asResponse() =
      TestMetadataResponse(
        id = id(),
        testId = immutableTestEntity().id(),
        name = name(),
        questionMetadata = questionMetadata.map { metadata -> metadata.asResponse() }
      )
  }
}

data class QuestionMetadataResponse(
  val id: UUID,
  val questionId: UUID,
  val text: String,
  val formatAndCode: FormatAndCodeDto,
  val correctAnswers: List<AnswerResponse>,
  val incorrectAnswers: List<AnswerResponse>,
) {
  companion object {
    fun QuestionMetadataEntity.asResponse() =
      QuestionMetadataResponse(
        id = id(),
        questionId = question().id(),
        text = text(),
        formatAndCode =
          Json.decodeFromString(FormatAndCode.serializer(), formatAndCode()).run {
            FormatAndCodeDto(format, code)
          },
        correctAnswers = correctAnswers().map { answer -> answer.asResponse() },
        incorrectAnswers = incorrectAnswers().map { answer -> answer.asResponse() }
      )
  }
}
