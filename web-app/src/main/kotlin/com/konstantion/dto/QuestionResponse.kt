package com.konstantion.dto

import com.konstantion.dto.CodeResponse.Companion.asResponse
import com.konstantion.dto.VariantResponse.Companion.asResponse
import com.konstantion.entity.QuestionEntity
import java.util.UUID

data class QuestionResponse(
    val id: UUID,
    val lang: String,
    val body: String,
    val formatAndCode: String,
    val placeholderDefinitions: Map<String, String>,
    val callArgs: List<String>,
    val additionalCheck: CodeResponse?,
    val correctVariants: List<VariantResponse>,
    val incorrectVariants: List<VariantResponse>,
    val validated: Boolean,
    val public: Boolean,
    val creatorId: UUID? = null
) : Response {
    companion object {
        fun QuestionEntity.asResponse(): QuestionResponse {
            return QuestionResponse(
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
                creatorId = creator()?.id()
            )

        }
    }
}
