package com.konstantion.dto.request

import com.konstantion.model.Role
import com.konstantion.service.RegisterParams

data class RegisterRequest(
  val username: String,
  val password: String,
  val email: String,
  val role: Role,
) {
  fun asParams(): RegisterParams =
    RegisterParams(username = username, password = password, email = email, role = role)
}
