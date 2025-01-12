package com.konstantion.model

import kotlinx.serialization.Serializable

@Serializable
sealed interface Lang {
  @Serializable
  data object JavaScript : Lang

  @Serializable
  data object Python : Lang
}
