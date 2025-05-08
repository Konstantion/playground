package com.konstantion.dto.request

import com.konstantion.model.Role
import com.konstantion.service.AuthService.RegisterParams

data class RegisterRequest(
  val username: String,
  val password: String,
  val role: Role,
) {
  fun asParams(): RegisterParams =
    RegisterParams(username = username, password = password, role = role)
}
