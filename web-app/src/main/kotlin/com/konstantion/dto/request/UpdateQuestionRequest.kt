package com.konstantion.dto.request

import com.fasterxml.jackson.databind.JsonNode
import com.konstantion.dto.common.FormatAndCodeDto
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderValue
import com.konstantion.service.QuestionService.UpdateQuestionParams
import kotlinx.serialization.json.Json
import java.util.UUID

data class UpdateQuestionRequest(
    val action: UpdateQuestionParams.Action,
    val body: String? = null,
    val formatAndCodeDto: FormatAndCodeDto? = null,
    val placeholderDefinition: Map<PlaceholderIdentifier, JsonNode>? = null,
    val callArg: List<JsonNode>? = null,
    val additionalCheck: UUID? = null,
    val correctVariant: UUID? = null,
    val incorrectVariant: UUID? = null,
    val public: Boolean? = null
) {
    fun asParams(): UpdateQuestionParams {
        return UpdateQuestionParams(
            action = action,
            body = body,
            formatAndCodeDto = formatAndCodeDto?.asModel(),
            placeholderDefinition = placeholderDefinition?.mapValues { (_, definition) ->
                Json.decodeFromString(
                    PlaceholderDefinition.serializer(PlaceholderValue.serializer()),
                    definition.toString()
                )
            },
            callArg = callArg?.map { callArg -> Json.decodeFromString(callArg.toString()) },
            additionalCheck = additionalCheck,
            correctVariant = correctVariant,
            incorrectVariant = incorrectVariant,
            public = public
        )
    }
}
