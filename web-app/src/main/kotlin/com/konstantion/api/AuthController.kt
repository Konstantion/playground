package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.LoginRequest
import com.konstantion.dto.request.RegisterRequest
import com.konstantion.dto.response.LoginResponse
import com.konstantion.dto.response.UserResponse
import com.konstantion.entity.UserEntity
import com.konstantion.service.AuthService
import com.konstantion.service.ServiceIssue
import com.konstantion.utils.Either
import com.konstantion.utils.TransactionsHelper
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
data class AuthController(
  private val authService: AuthService,
  private val transactionsHelper: TransactionsHelper,
) {
  @PostMapping("/login")
  fun login(
    @RequestBody request: LoginRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, AuthService.UserAndToken> =
        transactionsHelper.tx { authService.login(request.asParams()) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right ->
        ResponseEntity.ok(
          LoginResponse(result.value.token, UserResponse.fromEntity(result.value.user)),
        )
    }

  @PostMapping("/register")
  fun register(
    @RequestBody request: RegisterRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, UserEntity> =
        transactionsHelper.tx { authService.register(null, request.asParams()) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(UserResponse.fromEntity(result.value))
    }
}
