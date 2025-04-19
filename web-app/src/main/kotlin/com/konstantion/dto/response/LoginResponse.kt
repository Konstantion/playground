package com.konstantion.dto.response

data class LoginResponse(
  val accessToken: String,
  val type: String = "Bearer",
)
