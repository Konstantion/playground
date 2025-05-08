package com.konstantion.model

import kotlinx.serialization.Serializable

@Serializable
data class PlaceholderLabel(
  val identifier: PlaceholderIdentifier,
  val name: String,
)

@Serializable
enum class PlaceholderIdentifier {
  P_1,
  P_2,
  P_3,
  P_4,
  P_5,
  P_6,
  P_7,
  P_8,
  P_9,
  P_10,
}
