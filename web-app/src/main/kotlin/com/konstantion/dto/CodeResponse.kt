package com.konstantion.dto

import com.konstantion.entity.CodeEntity
import java.util.UUID

data class CodeResponse(
    val id: UUID,
    val code: String,
    val outputType: String
) : Response {
    companion object {
        fun CodeEntity.asResponse() = CodeResponse(
            id = id(),
            code = code(),
            outputType = outputType()
        )
    }
}
