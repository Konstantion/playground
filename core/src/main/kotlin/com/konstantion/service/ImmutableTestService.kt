package com.konstantion.service

import com.konstantion.entity.CodeEntity
import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.TestModelEntity
import com.konstantion.entity.VariantEntity
import com.konstantion.executor.TestModelExecutor
import com.konstantion.model.User
import com.konstantion.repository.CodeRepository
import com.konstantion.repository.ImmutableTestRepository
import com.konstantion.repository.QuestionRepository
import com.konstantion.repository.TestMetadataRepository
import com.konstantion.repository.TestModelRepository
import com.konstantion.repository.UserRepository
import com.konstantion.repository.UserTestRepository
import com.konstantion.repository.VariantRepository
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import java.time.LocalDateTime
import java.util.UUID
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
data class ImmutableTestService(
  private val immutableTestRepository: ImmutableTestRepository,
  private val testModelRepository: TestModelRepository,
  private val questionRepository: QuestionRepository,
  private val variantRepository: VariantRepository,
  private val codeRepository: CodeRepository,
  private val userRepository: UserRepository,
  private val testMetadataRepository: TestMetadataRepository,
  private val userTestRepository: UserTestRepository,
  private val testModelExecutor: TestModelExecutor,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  @Transactional
  fun createImmutableTest(
    user: User,
    testModelId: UUID
  ): Either<ServiceIssue, ImmutableTestEntity> {
    log.info(
      "CreateImmutableTest[userId={}, username={}, testModelId={}]",
      user.id(),
      user.getUsername(),
      testModelId
    )

    if (user.isStudent()) {
      return Forbidden.asEither("User is not allowed to create immutable test.")
    }

    val maybeQuestion =
      when (
        val result: Either<ServiceIssue, Maybe<TestModelEntity>> =
          testModelRepository
            .sqlAction { findById(testModelId) }
            .map { maybeQuestion -> maybeQuestion.asMaybe() }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    val testModel: TestModelEntity =
      when (maybeQuestion) {
        is Maybe.Just -> maybeQuestion.value
        Maybe.None -> return Either.left(UnexpectedAction("Test model not found: $testModelId"))
      }

    if (!user.isAdmin() || user.id() != testModel.creator?.id()) {
      return Forbidden.asEither("User is not allowed to create immutable test.")
    }

    if (!testModel.questions.all { entity -> entity.validated() }) {
      return Either.left(UnexpectedAction("Test model is not validated: $testModelId"))
    }

    if (testModel.questions().isEmpty()) {
      return Either.left(UnexpectedAction("Test model has no questions: $testModelId"))
    }

    val deepClone = deepCloneTestModel(testModel)
    val userEntity = userRepository.findById(user.id()).orElseThrow()
    val immutableTest =
      ImmutableTestEntity().apply {
        name = deepClone.name
        active = deepClone.active
        createdAt = LocalDateTime.now()
        questions = deepClone.questions
        creator = userEntity
      }

    val immutableEntity = immutableTestRepository.saveAndFlush(immutableTest)
    return Either.right(immutableEntity)
  }

  fun setExpiration(
    user: User,
    immutableTestId: UUID,
    expiresAfter: LocalDateTime
  ): Either<ServiceIssue, Unit> {
    log.info(
      "SetExpiration[userId={}, username={}, immutableTestId={}, expiresAfter={}]",
      user.id(),
      user.getUsername(),
      immutableTestId,
      expiresAfter
    )

    if (user.isStudent()) {
      return Forbidden.asEither("User is not allowed to set expiration.")
    }

    val maybeImmutableTest =
      when (
        val result: Either<ServiceIssue, Maybe<ImmutableTestEntity>> =
          immutableTestRepository
            .sqlAction { findById(immutableTestId) }
            .map { maybeQuestion -> maybeQuestion.asMaybe() }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    val immutableTest: ImmutableTestEntity =
      when (maybeImmutableTest) {
        is Maybe.Just -> maybeImmutableTest.value
        Maybe.None ->
          return Either.left(UnexpectedAction("Immutable test not found: $immutableTestId"))
      }

    if (!user.isAdmin() || user.id() != immutableTest.creator?.id()) {
      return Forbidden.asEither("User is not allowed to set expiration.")
    }

    immutableTest.expiresAfter = expiresAfter
    immutableTestRepository.saveAndFlush(immutableTest)
    return Either.right(Unit)
  }

  private fun deepCloneTestModel(original: TestModelEntity): TestModelEntity {
    val clone =
      TestModelEntity().apply {
        name = original.name
        active = original.active
        createdAt = LocalDateTime.now()
        // Optionally, you might also want to copy the creator if that makes sense.
        creator = original.creator
      }

    clone.questions =
      original.questions
        .map { question ->
          val clonedQuestion =
            QuestionEntity().apply {
              lang = question.lang
              body = question.body
              formatAndCode = question.formatAndCode
              placeholderDefinitions = HashMap(question.placeholderDefinitions)
              callArgs = ArrayList(question.callArgs)
              validated = question.validated
              public = question.public
              createdAt = LocalDateTime.now()
              creator = question.creator
            }

          clonedQuestion.additionalCheck =
            question.additionalCheck?.let { codeEntity ->
              CodeEntity().apply {
                code = codeEntity.code
                outputType = codeEntity.outputType
              }
            }

          clonedQuestion.correctVariants =
            question.correctVariants
              .map { variant ->
                VariantEntity().apply {
                  code =
                    variant.code?.let { codeEntity ->
                      CodeEntity().apply {
                        code = codeEntity.code
                        outputType = codeEntity.outputType
                      }
                    }
                  createdAt = LocalDateTime.now()
                  createdBy = variant.createdBy
                }
              }
              .toMutableList()

          clonedQuestion.incorrectVariants =
            question.incorrectVariants
              .map { variant ->
                VariantEntity().apply {
                  code =
                    variant.code?.let { codeEntity ->
                      CodeEntity().apply {
                        code = codeEntity.code
                        outputType = codeEntity.outputType
                      }
                    }
                  createdAt = LocalDateTime.now()
                  createdBy = variant.createdBy
                }
              }
              .toMutableList()

          clonedQuestion
        }
        .toMutableList()

    return clone
  }
}
