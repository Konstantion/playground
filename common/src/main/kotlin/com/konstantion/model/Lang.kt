package com.konstantion.model

import com.konstantion.model.serializaers.LangSerializer
import kotlinx.serialization.Serializable

@Serializable(with = LangSerializer::class)
sealed interface Lang {
  data object JavaScript : Lang

  data object Python : Lang

  companion object {
    fun fromString(lang: String): Lang {
      return when (lang) {
        "javascript" -> JavaScript
        "python" -> Python
        else -> error("Unknown lang: $lang")
      }
    }
  }
}
