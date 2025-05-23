package com.konstantion.dto.request

import com.konstantion.service.AuthService

data class LoginRequest(
  val username: String,
  val password: String,
) {
  fun asParams(): AuthService.LoginParams =
    AuthService.LoginParams(
      username = username,
      password = password,
    )
}
