package com.konstantion.service

import com.konstantion.entity.CodeEntity
import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.TestModelEntity
import com.konstantion.entity.UserEntity
import com.konstantion.entity.VariantEntity
import com.konstantion.executor.TestModelExecutor
import com.konstantion.repository.CodeRepository
import com.konstantion.repository.ImmutableTestRepository
import com.konstantion.repository.QuestionRepository
import com.konstantion.repository.TestMetadataRepository
import com.konstantion.repository.TestModelRepository
import com.konstantion.repository.UserRepository
import com.konstantion.repository.UserTestRepository
import com.konstantion.repository.VariantRepository
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.service.SqlHelper.sqlOptionalAction
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import java.time.Instant
import java.util.UUID
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

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

  fun findAllByCreator(user: UserEntity): Either<ServiceIssue, List<ImmutableTestEntity>> {
    log.info(
      "FindAllByCreator[userId={}, username={}]",
      user.id(),
      user.username(),
    )

    if (user.isStudent()) {
      return Forbidden.asEither("User is not allowed to find immutable tests.")
    }

    return when (
      val result: Either<ServiceIssue, List<ImmutableTestEntity>> =
        immutableTestRepository.sqlAction { findAllByCreatorId(user.id()) }
    ) {
      is Either.Left -> Either.left(result.value)
      is Either.Right -> Either.right(result.value)
    }
  }

  fun findById(user: UserEntity, id: UUID): Either<ServiceIssue, ImmutableTestEntity> {
    log.info(
      "FindById[userId={}, username={}, id={}]",
      user.id(),
      user.username(),
      id,
    )

    if (user.isStudent()) {
      return Forbidden.asEither("User is not allowed to find immutable tests.")
    }

    return when (
      val result: Either<ServiceIssue, ImmutableTestEntity> =
        immutableTestRepository.sqlOptionalAction { findById(id) }
    ) {
      is Either.Left -> Either.left(result.value)
      is Either.Right -> {
        val test = result.value
        if (test.creator?.id() == user.id()) {
          Either.right(test)
        } else {
          Forbidden.asEither("User is not allowed to find immutable tests.")
        }
      }
    }
  }

  fun createImmutableTest(
    user: UserEntity,
    createParams: CreateImmutableParams,
  ): Either<ServiceIssue, ImmutableTestEntity> {
    log.info(
      "CreateImmutableTest[userId={}, username={}, params={}]",
      user.id(),
      user.username(),
      createParams,
    )

    if (user.isStudent()) {
      return Forbidden.asEither("User is not allowed to create immutable test.")
    }

    val (testModelId, expiresAfterParam, shuffleQuestionsParam, shuffleVariantsParam) = createParams
    val expiresAfterInstant: Instant? = expiresAfterParam?.run(Instant::ofEpochMilli)
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

    if (!user.isAdmin() && user.id() != testModel.creator?.id()) {
      return Forbidden.asEither("User is not allowed to create immutable test.")
    }

    if (!testModel.questions.all { entity -> entity.validated() }) {
      return Either.left(UnexpectedAction("Not all questions are validated: $testModelId"))
    }

    if (testModel.questions().isEmpty()) {
      return Either.left(UnexpectedAction("Test model has no questions: $testModelId"))
    }

    if (expiresAfterInstant != null && expiresAfterInstant.isBefore(Instant.now())) {
      return Either.left(UnexpectedAction("Expiration date is in the past: $expiresAfterParam"))
    }

    val deepClone = deepCloneTestModel(testModel)
    val userEntity = userRepository.findById(user.id()).orElseThrow()
    val immutableTest =
      ImmutableTestEntity().apply {
        name = deepClone.name
        active = true
        createdAt = Instant.now()
        questions = deepClone.questions
        creator = userEntity
        expiresAfter = expiresAfterInstant
        shuffleVariants = shuffleVariantsParam
        shuffleQuestions = shuffleQuestionsParam
      }

    val immutableEntity = immutableTestRepository.saveAndFlush(immutableTest)
    return Either.right(immutableEntity)
  }

  private fun deepCloneTestModel(original: TestModelEntity): TestModelEntity {
    val clone =
      TestModelEntity().apply {
        name = original.name
        createdAt = Instant.now()
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
              public = false
              createdAt = Instant.now()
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
                  public = false
                  createdAt = Instant.now()
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
                  public = false
                  createdAt = Instant.now()
                  createdBy = variant.createdBy
                }
              }
              .toMutableList()

          clonedQuestion
        }
        .toMutableList()

    return clone
  }

  data class CreateImmutableParams(
    val testModelId: UUID,
    val expiresAfter: Long?,
    val shuffleQuestions: Boolean,
    val shuffleVariants: Boolean,
  )
}
