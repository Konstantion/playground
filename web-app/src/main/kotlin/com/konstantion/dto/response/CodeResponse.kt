package com.konstantion.dto.response

import com.fasterxml.jackson.annotation.JsonRawValue
import com.konstantion.entity.CodeEntity
import java.util.UUID

data class CodeResponse(val id: UUID, val code: String, @JsonRawValue val outputType: String) {
  companion object {
    fun CodeEntity.asResponse() = CodeResponse(id = id(), code = code(), outputType = outputType())
  }
}
