package com.konstantion.model

import kotlinx.serialization.Serializable

@Serializable
data class FormatAndCode(private val format: String, private val code: String) {
  init {
    check(format.isNotBlank()) { "Format shouldn't be blank." }
    check(code.isNotBlank()) { "Code shouldn't be blank." }
  }
}
