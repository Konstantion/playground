package com.konstantion.dto.common

import com.konstantion.model.FormatAndCode

data class FormatAndCodeDto(val format: String, val code: String) {
  fun asModel(): FormatAndCode {
    return FormatAndCode(format = format, code = code)
  }
}
