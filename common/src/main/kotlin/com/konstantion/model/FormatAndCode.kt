package com.konstantion.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class FormatAndCode(val format: String, val code: String) {
  init {
    check(format.isNotBlank()) { "Format shouldn't be blank." }
    check(code.isNotBlank()) { "Code shouldn't be blank." }
  }

  fun reformated(placeholderValues: Map<PlaceholderIdentifier, PlaceholderValue>): FormatAndCode {
    var code = this.code
    for ((identifier, value) in placeholderValues) {
      code = code.replace(identifier.toString(), value.asString())
    }
    return FormatAndCode(this.format, code)
  }

  companion object {
    private val EMPTY = FormatAndCode("python", "print('Hello, world!')")

    fun emptyJson() = Json.encodeToString(EMPTY)
  }
}
