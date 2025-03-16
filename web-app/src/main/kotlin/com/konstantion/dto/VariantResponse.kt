package com.konstantion.dto

import com.konstantion.dto.CodeResponse.Companion.asResponse
import com.konstantion.entity.VariantEntity
import java.util.UUID

data class VariantResponse(val id: UUID, val identifier: UUID, val code: CodeResponse) {
  companion object {
    fun VariantEntity.asResponse() =
      VariantResponse(id = id(), identifier = identifier(), code = code().asResponse())
  }
}
