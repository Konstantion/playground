package com.konstantion.dto.request

import com.konstantion.service.VariantService

@JvmRecord
data class CreateVariantRequest(val code: String) {
  fun asParams(): VariantService.CreateParams = VariantService.CreateParams(code)
}
