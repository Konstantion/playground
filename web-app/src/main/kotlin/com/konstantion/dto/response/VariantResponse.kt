package com.konstantion.dto.response

import com.konstantion.dto.response.CodeResponse.Companion.asResponse
import com.konstantion.entity.VariantEntity
import java.util.UUID

data class VariantResponse(val id: UUID, val code: CodeResponse) {
  companion object {
    fun VariantEntity.asResponse() = VariantResponse(id = id(), code = code().asResponse())
  }
}
