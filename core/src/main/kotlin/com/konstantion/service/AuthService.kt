package com.konstantion.service

import com.konstantion.entity.UserEntity
import com.konstantion.model.Role
import com.konstantion.model.User
import com.konstantion.repository.UserRepository
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.service.SqlHelper.sqlOptionalAction
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import java.util.Date
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

private val SECRET = "mylittlesecretisitlongenough".repeat(10)
private const val EXPIRATION_TIME = 86400000

@Service
data class AuthService(private val userRepository: UserRepository) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  fun login(params: LoginParams): Either<ServiceIssue, UserAndToken> {
    log.info("Login[params={}]", params)

    val user: UserEntity =
      when (
        val result: Either<ServiceIssue, Maybe<UserEntity>> =
          userRepository.sqlAction { findByUsername(params.username).asMaybe() }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right ->
          when (result.value) {
            is Maybe.Just -> result.value.orElseThrow()
            Maybe.None ->
              return Either.left(UnexpectedAction("User not found, username=${params.username}"))
          }
      }

    if (user.password != params.password) {
      return Either.left(UnexpectedAction("Invalid password"))
    }

    return Either.right(UserAndToken(user, generateToken(user)))
  }

  fun register(user: User?, params: RegisterParams): Either<ServiceIssue, UserEntity> {
    log.info("Register[user={}, params={}]", user, params)

    val maybeUser =
      when (
        val result: Either<ServiceIssue, Maybe<UserEntity>> =
          userRepository.sqlAction { findByUsername(params.username).asMaybe() }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    if (maybeUser.isPresent) {
      return Either.left(UnexpectedAction("User already exists, username=${params.username}"))
    }

    if (params.role == Role.Admin && user?.role() != Role.Admin) {
      return Either.left(UnexpectedAction("Only admin can create admin user"))
    }

    val toSave =
      UserEntity().apply {
        username = params.username
        password = params.password
        role = params.role
        anonymous = false
        // TODO: add permissions
        permissions = mutableSetOf()
      }

    val userDb: UserEntity =
      when (
        val result: Either<ServiceIssue, UserEntity> = userRepository.sqlAction { save(toSave) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    return Either.right(userDb)
  }

  fun extractUser(token: String): Either<ServiceIssue, UserEntity> {
    log.info("ExtractUser[token={}]", token)
    if (isExpired(token)) {
      return Either.left(TokenExpired("Token is expired"))
    }

    val username = getClaims(token).subject
    val userDb =
      when (
        val result: Either<ServiceIssue, UserEntity> =
          userRepository.sqlOptionalAction { findByUsername(username) }
      ) {
        is Either.Left -> return Either.left(TokenExpired(result.value.message()))
        is Either.Right -> result.value
      }

    return Either.right(userDb)
  }

  private fun isExpired(token: String): Boolean {
    return getClaims(token).expiration.before(Date())
  }

  private fun getClaims(token: String): Claims {
    return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).body
  }

  private fun generateToken(user: UserEntity): String {
    return Jwts.builder()
      .setSubject(user.username)
      .setIssuedAt(Date(System.currentTimeMillis()))
      .setExpiration(Date(System.currentTimeMillis() + EXPIRATION_TIME))
      .signWith(SignatureAlgorithm.HS512, SECRET)
      .compact()
  }

  data class LoginParams(val username: String, val password: String)

  data class UserAndToken(
    val user: UserEntity,
    val token: String,
  )

  data class RegisterParams(
    val username: String,
    val password: String,
    val role: Role,
  )
}
