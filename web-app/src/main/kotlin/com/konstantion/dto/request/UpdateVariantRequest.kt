package com.konstantion.dto.request

import com.konstantion.service.VariantService
import java.util.UUID

data class UpdateVariantRequest(
  val code: String,
) {
  fun asParams(id: UUID): VariantService.UpdateParams =
    VariantService.UpdateParams(id = id, code = code)
}
