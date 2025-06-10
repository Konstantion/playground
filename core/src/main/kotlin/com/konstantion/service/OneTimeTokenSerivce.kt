package com.konstantion.service

import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.UserEntity
import com.konstantion.repository.UserRepository
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import java.nio.ByteBuffer
import java.util.Base64
import java.util.Optional
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit
import org.springframework.stereotype.Service

data class OneTimeTokenData(
  val username: String,
  val testId: UUID,
  val createdAt: Long = System.currentTimeMillis(),
)

interface OneTimeTokenService {
  fun generate(
    user: UserEntity,
    username: String,
    testId: UUID,
  ): Either<ServiceIssue, String>

  fun activate(token: String): Maybe<OneTimeTokenData>
}

@Service
class OneTimeTokenServiceImpl(
  private val userRepository: UserRepository,
  private val immutableTestService: ImmutableTestService,
) : OneTimeTokenService {
  private val tokens = ConcurrentHashMap<String, OneTimeTokenData>()
  private val tokenLifetime = TimeUnit.HOURS.toMillis(24)

  override fun generate(
    user: UserEntity,
    username: String,
    testId: UUID,
  ): Either<ServiceIssue, String> {
    if (user.isStudent()) {
      return Either.left(Forbidden("Students are not allowed to generate one-time tokens."))
    }

    if (username.isBlank()) {
      return Either.left(UnexpectedAction("Username cannot be blank."))
    }

    when (
      val result: Either<ServiceIssue, Optional<UserEntity>> =
        userRepository.sqlAction { findByUsername(username) }
    ) {
      is Either.Left -> return Either.left(result.value)
      is Either.Right -> {
        if (result.value.isPresent) {
          return Either.left(UnexpectedAction("Username already exists: $username"))
        }
      }
    }

    when (
      val result: Either<ServiceIssue, Maybe<ImmutableTestEntity>> =
        immutableTestService.findByIdNotArchived(testId)
    ) {
      is Either.Left -> return Either.left(result.value)
      is Either.Right -> {
        if (result.value.isEmpty) {
          return Either.left(UnexpectedAction("Test with ID $testId not found or is archived."))
        }
      }
    }

    val uuid = UUID.randomUUID()
    val buffer = ByteBuffer.allocate(16)
    buffer.putLong(uuid.mostSignificantBits)
    buffer.putLong(uuid.leastSignificantBits)
    val token = Base64.getUrlEncoder().withoutPadding().encodeToString(buffer.array())
    tokens[token] = OneTimeTokenData(username, testId)
    return Either.right(token)
  }

  override fun activate(token: String): Maybe<OneTimeTokenData> {
    val data = tokens.remove(token) ?: return Maybe.none()
    if (System.currentTimeMillis() - data.createdAt > tokenLifetime) {
      return Maybe.none()
    }
    return Maybe.just(data)
  }
}
