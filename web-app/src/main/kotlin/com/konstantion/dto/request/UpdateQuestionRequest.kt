package com.konstantion.dto.request

import com.fasterxml.jackson.databind.JsonNode
import com.konstantion.dto.common.FormatAndCodeDto
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderValue
import com.konstantion.service.QuestionService.UpdateQuestionParams
import java.util.UUID
import kotlinx.serialization.json.Json

data class UpdateQuestionRequest(
  val action: UpdateQuestionParams.Action,
  val body: String? = null,
  val formatAndCodeDto: FormatAndCodeDto? = null,
  val placeholderDefinition: Map<PlaceholderIdentifier, JsonNode>? = null,
  val placeholders: List<PlaceholderIdentifier>? = null,
  val callArgs: List<JsonNode>? = null,
  val args: List<String>? = null,
  val additionalCheck: UUID? = null,
  val correctVariant: UUID? = null,
  val incorrectVariant: UUID? = null,
) {
  fun asParams(): UpdateQuestionParams {
    return UpdateQuestionParams(
      action = action,
      body = body,
      formatAndCode = formatAndCodeDto?.asModel(),
      placeholderDefinitions =
        placeholderDefinition?.mapValues { (_, definition) ->
          Json.decodeFromString(
            PlaceholderDefinition.serializer(PlaceholderValue.serializer()),
            definition.toString()
          )
        },
      placeholders = placeholders,
      callArgs = callArgs?.map { callArg -> Json.decodeFromString(callArg.toString()) },
      args = args,
      additionalCheckId = additionalCheck,
      correctVariantId = correctVariant,
      incorrectVariantId = incorrectVariant,
    )
  }
}
