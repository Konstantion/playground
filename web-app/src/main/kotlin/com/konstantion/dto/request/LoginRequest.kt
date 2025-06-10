package com.konstantion.dto.request

import com.konstantion.service.LoginParams

data class LoginRequest(
  val username: String,
  val password: String,
) {
  fun asParams(): LoginParams =
    LoginParams(
      username = username,
      password = password,
    )
}
