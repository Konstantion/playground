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
  val callArg: List<JsonNode>? = null,
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
      callArgs = callArg?.map { callArg -> Json.decodeFromString(callArg.toString()) },
      additionalCheckId = additionalCheck,
      correctVariantId = correctVariant,
      incorrectVariantId = incorrectVariant,
    )
  }
}
