package com.konstantion.dto.response

import com.fasterxml.jackson.annotation.JsonRawValue
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.konstantion.dto.response.CodeResponse.Companion.asResponse
import com.konstantion.dto.response.VariantResponse.Companion.asResponse
import com.konstantion.dto.serializers.ListRawSerializer
import com.konstantion.dto.serializers.MapRawSerializer
import com.konstantion.entity.QuestionEntity
import java.time.ZoneId
import java.util.UUID

data class QuestionResponse(
  val id: UUID,
  @JsonRawValue val lang: String,
  val body: String,
  @JsonRawValue val formatAndCode: String,
  @get:JsonSerialize(using = MapRawSerializer::class)
  val placeholderDefinitions: Map<String, String>,
  @get:JsonSerialize(using = ListRawSerializer::class) val callArgs: List<String>,
  val additionalCheck: CodeResponse?,
  val correctVariants: List<VariantResponse>,
  val incorrectVariants: List<VariantResponse>,
  val validated: Boolean,
  val public: Boolean,
  val creatorId: UUID? = null,
  val createdAt: Long,
) {
  companion object {
    fun QuestionEntity.asResponse(): QuestionResponse =
      QuestionResponse(
        id = id(),
        lang = lang(),
        body = body(),
        formatAndCode = formatAndCode(),
        placeholderDefinitions = placeholderDefinitions(),
        callArgs = callArgs(),
        additionalCheck = additionalCheck()?.asResponse(),
        correctVariants = correctVariants().map { variant -> variant.asResponse() },
        incorrectVariants = incorrectVariants().map { variant -> variant.asResponse() },
        validated = validated(),
        public = public(),
        creatorId = creator()?.id(),
        createdAt = createdAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli(),
      )

    fun List<QuestionEntity>.asResponse(): List<QuestionResponse> = map { question ->
      question.asResponse()
    }
  }
}
