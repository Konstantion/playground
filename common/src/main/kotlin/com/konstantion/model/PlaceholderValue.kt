package com.konstantion.model

import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonClassDiscriminator

@OptIn(ExperimentalSerializationApi::class)
@Serializable
@JsonClassDiscriminator("type")
sealed interface PlaceholderValue {

  fun asString(): String

  @Serializable
  @SerialName("str")
  data class Str(val value: String) : PlaceholderValue {
    override fun asString(): String = "\"${this.value.replace("\"", "\\\"")}\""
  }

  @Serializable
  @SerialName("i32")
  data class I32(val value: Int) : PlaceholderValue, Comparable<I32> {
    override fun compareTo(other: I32): Int {
      return this.value.compareTo(other.value)
    }

    override fun asString(): String = this.value.toString()
  }
}
