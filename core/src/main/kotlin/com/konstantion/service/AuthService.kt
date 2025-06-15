package com.konstantion.service

import com.konstantion.entity.UserEntity
import com.konstantion.entity.UserTestEntity
import com.konstantion.model.Role
import com.konstantion.repository.UserRepository
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.service.SqlHelper.sqlOptionalAction
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import java.util.Date
import java.util.UUID
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

private val SECRET = "mylittlesecretisitlongenough".repeat(10)
private const val EXPIRATION_TIME = 86400000

interface PasswordEncoder {
  fun encode(password: String): String

  fun matches(
    rawPassword: String,
    encodedPassword: String,
  ): Boolean

  data object NoOp : PasswordEncoder {
    override fun encode(password: String): String = password

    override fun matches(
      rawPassword: String,
      encodedPassword: String,
    ): Boolean = rawPassword == encodedPassword
  }
}

interface AuthService {
  fun register(
    user: UserEntity?,
    params: RegisterParams,
  ): Either<ServiceIssue, UserEntity>

  fun login(params: LoginParams): Either<ServiceIssue, UserAndToken>

  fun loginWithOneTimeToken(token: String): Either<ServiceIssue, UserAndToken>

  fun extractUser(token: String): Either<ServiceIssue, UserEntity>
}

@Service
data class AuthServiceImpl(
  private val userRepository: UserRepository,
  private val oneTimeTokenService: OneTimeTokenService,
  private val userTestService: UserTestService,
  private val immutableTestService: ImmutableTestService,
) : AuthService {
  private val log: Logger = LoggerFactory.getLogger(javaClass)
  private val passwordEncoder: PasswordEncoder = PasswordEncoder.NoOp

  override fun login(params: LoginParams): Either<ServiceIssue, UserAndToken> {
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

    if (user.anonymous) {
      return Either.left(UnexpectedAction("Anonymous user cannot login"))
    }

    if (!passwordEncoder.matches(user.password(), params.password)) {
      return Either.left(UnexpectedAction("Invalid password or username"))
    }

    return Either.right(UserAndToken(user, generateToken(user)))
  }

  override fun loginWithOneTimeToken(token: String): Either<ServiceIssue, UserAndToken> {
    val tokenData: OneTimeTokenData =
      when (val result = oneTimeTokenService.activate(token)) {
        is Maybe.Just -> result.value
        Maybe.None -> return Either.left(UnexpectedAction("Invalid or expired one-time token"))
      }

    when (
      val ignored: Either<ServiceIssue, UserEntity> =
        userRepository.sqlOptionalAction { findByUsername(tokenData.username) }
    ) {
      is Either.Left -> {}
      is Either.Right ->
        return Either.left(UnexpectedAction("User already exists, username=${tokenData.username}"))
    }

    val immutableTest =
      when (val result = immutableTestService.findByIdNotArchived(tokenData.testId)) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right ->
          when (val maybeImmutableTest = result.value) {
            is Maybe.Just -> maybeImmutableTest.value
            Maybe.None ->
              return Either.left(UnexpectedAction("Test not found, id=${tokenData.testId}"))
          }
      }

    val password = UUID.randomUUID().toString()
    val user =
      UserEntity().apply {
        this.username = tokenData.username
        this.password = password
        this.role = Role.Student
        this.anonymous = true
        this.email = ""
      }

    val userDb: UserEntity =
      when (
        val result: Either<ServiceIssue, UserEntity> = userRepository.sqlAction { save(user) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    when (
      val result: Either<ServiceIssue, UserTestEntity> =
        userTestService.createTestForUser(userDb, immutableTest.id(), true)
    ) {
      is Either.Left -> return Either.left(result.value)
      is Either.Right -> {}
    }

    return Either.right(UserAndToken(user, generateToken(user)))
  }

  override fun register(
    user: UserEntity?,
    params: RegisterParams,
  ): Either<ServiceIssue, UserEntity> {
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
        password = passwordEncoder.encode(params.password)
        email = params.email
        role = params.role
        anonymous = false
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

  override fun extractUser(token: String): Either<ServiceIssue, UserEntity> {
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

  private fun isExpired(token: String): Boolean =
    try {
      getClaims(token).expiration.before(Date())
    } catch (expiredException: ExpiredJwtException) {
      true
    }

  private fun getClaims(token: String): Claims =
    Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).body

  private fun generateToken(user: UserEntity): String =
    Jwts.builder()
      .setSubject(user.username)
      .setIssuedAt(Date(System.currentTimeMillis()))
      .setExpiration(Date(System.currentTimeMillis() + EXPIRATION_TIME))
      .signWith(SignatureAlgorithm.HS512, SECRET)
      .compact()
}

data class LoginParams(
  val username: String,
  val password: String,
)

data class UserAndToken(
  val user: UserEntity,
  val token: String,
)

data class RegisterParams(
  val username: String,
  val password: String,
  val email: String,
  val role: Role,
)
