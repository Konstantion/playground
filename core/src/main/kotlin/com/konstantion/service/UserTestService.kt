package com.konstantion.service

import com.konstantion.entity.AnswerEntity
import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.QuestionMetadataEntity
import com.konstantion.entity.TestMetadataEntity
import com.konstantion.entity.UserQuestionAnswerEntity
import com.konstantion.entity.UserTestEntity
import com.konstantion.executor.TestModelExecutor
import com.konstantion.model.Answer
import com.konstantion.model.QuestionMetadata
import com.konstantion.model.TestModel
import com.konstantion.model.TestModelMetadata
import com.konstantion.model.User
import com.konstantion.repository.CodeRepository
import com.konstantion.repository.ImmutableTestRepository
import com.konstantion.repository.QuestionMetadataRepository
import com.konstantion.repository.QuestionRepository
import com.konstantion.repository.TestMetadataRepository
import com.konstantion.repository.TestModelRepository
import com.konstantion.repository.UserQuestionAnswerRepository
import com.konstantion.repository.UserRepository
import com.konstantion.repository.UserTestRepository
import com.konstantion.repository.VariantRepository
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.service.SqlHelper.sqlOptionalAction
import com.konstantion.utils.Either
import java.time.LocalDateTime
import java.util.UUID
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
data class UserTestService(
  private val immutableTestRepository: ImmutableTestRepository,
  private val testModelRepository: TestModelRepository,
  private val questionRepository: QuestionRepository,
  private val variantRepository: VariantRepository,
  private val codeRepository: CodeRepository,
  private val userRepository: UserRepository,
  private val testMetadataRepository: TestMetadataRepository,
  private val userTestRepository: UserTestRepository,
  private val userQuestionAnswerRepository: UserQuestionAnswerRepository,
  private val testModelExecutor: TestModelExecutor,
  private val questionMetadataRepository: QuestionMetadataRepository,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)
  private val service: ScheduledExecutorService =
    Executors.newSingleThreadScheduledExecutor().also { scheduledExecutorService ->
      scheduledExecutorService.scheduleAtFixedRate(::deactivateExpired, 0L, 5, TimeUnit.MINUTES)
      Runtime.getRuntime()
        .addShutdownHook(
          Thread {
            log.info("Shutting down scheduled executor service")
            scheduledExecutorService.shutdown()
          }
        )
    }

  fun createTestForUser(targetUser: User, testModelId: UUID): Either<ServiceIssue, UserTestEntity> {
    log.info(
      "CreateUserTest[userId={}, username={}, immutableTestModelId={}]",
      targetUser.id(),
      targetUser.getUsername(),
      testModelId
    )

    val immutableTestEntityDb =
      when (
        val result: Either<ServiceIssue, ImmutableTestEntity> =
          immutableTestRepository.sqlOptionalAction { findById(testModelId) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    if (!immutableTestEntityDb.active) {
      return Either.left(UnexpectedAction("Immutable test is not active: $testModelId"))
    }

    if (
      immutableTestEntityDb.expiresAfter != null &&
        immutableTestEntityDb.expiresAfter!!.isBefore(LocalDateTime.now())
    ) {
      return Either.left(UnexpectedAction("Immutable test is expired: $testModelId"))
    }

    if (immutableTestEntityDb.userTests.any { test -> test.user().id() == targetUser.id() }) {
      return Either.left(UnexpectedAction("User test already exists for user: ${targetUser.id()}"))
    }

    val testModel =
      TestModel(
        id = immutableTestEntityDb.id(),
        name = immutableTestEntityDb.name(),
        questions = immutableTestEntityDb.questions().map { question -> question.toModel() }
      )

    val metadata: TestModelMetadata =
      when (
        val executorResult: Either<TestModelExecutor.Issue, TestModelMetadata> =
          testModelExecutor.run(testModel)
      ) {
        is Either.Left ->
          return Either.left(
            UnexpectedAction(
              "Test model execution failed: ${testModel.id}, ${executorResult.value}"
            )
          )
        is Either.Right -> executorResult.value
      }

    val idToQuestion =
      immutableTestEntityDb.questions().associateBy { questionEntity -> questionEntity.id() }

    val toSave: TestMetadataEntity =
      TestMetadataEntity().apply {
        immutableTestEntity = immutableTestEntityDb
        name = metadata.name
        questionMetadata =
          metadata.questionMetadatas
            .map { questionMetadata: QuestionMetadata ->
              val questionEntity = idToQuestion[questionMetadata.questionIdentifier]!!
              QuestionMetadataEntity().apply {
                question = questionEntity
                text = questionMetadata.text
                formatAndCode = Json.encodeToString(questionMetadata.formatAndCode)
                correctAnswers =
                  questionMetadata.correctAnswers
                    .map { answer: Answer -> toAnswerEntity(answer, questionEntity) }
                    .toMutableList()
                incorrectAnswers =
                  questionMetadata.intersectAnswer
                    .map { answer: Answer -> toAnswerEntity(answer, questionEntity) }
                    .toMutableList()
              }
            }
            .toMutableList()
      }

    val testMetadataDb =
      when (
        val result: Either<ServiceIssue, TestMetadataEntity> =
          testMetadataRepository.sqlAction { saveAndFlush(toSave) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    val userTestEntityToSave =
      UserTestEntity().apply {
        immutableTest = immutableTestEntityDb
        testMetadata = testMetadataDb
        user = userRepository.findById(targetUser.id()).orElseThrow()
        questionAnswers = mutableListOf()
      }

    val userTestDb =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          userTestRepository.sqlAction { saveAndFlush(userTestEntityToSave) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    immutableTestEntityDb.userTests.add(userTestDb)
    when (val result = immutableTestRepository.sqlAction { saveAndFlush(immutableTestEntityDb) }) {
      is Either.Left -> return Either.left(result.value)
      else -> {}
    }

    return Either.right(userTestDb)
  }

  fun getTestForUser(targetUser: User, testModelId: UUID): Either<ServiceIssue, UserTestEntity> {
    log.info(
      "GetUserTest[userId={}, username={}, immutableTestModelId={}]",
      targetUser.id(),
      targetUser.getUsername(),
      testModelId
    )

    return findTestForUser(targetUser, testModelId)
  }

  fun submitUserAnswer(
    targetUser: User,
    params: UserAnswerParams
  ): Either<ServiceIssue, UserTestEntity> {
    log.info(
      "SubmitUserAnswer[userId={}, username={}, testId={}]",
      targetUser.id(),
      targetUser.getUsername(),
      params.testId
    )

    val testDb: UserTestEntity =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          findTestForUser(targetUser, params.testId)
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    if (!testDb.active) {
      return Either.left(UnexpectedAction("Test is not active: ${params.testId}"))
    }

    val userAnswers: MutableList<UserQuestionAnswerEntity> = mutableListOf()
    for ((questionMetadataId, answersIds) in params.answers) {
      val questionMetadataDb: QuestionMetadataEntity =
        when (
          val result: Either<ServiceIssue, QuestionMetadataEntity> =
            questionMetadataRepository.sqlOptionalAction { findById(questionMetadataId) }
        ) {
          is Either.Left -> return Either.left(result.value)
          is Either.Right -> result.value
        }

      val questionMetadataAnswersDb = questionMetadataDb.answers()
      val answersDb: MutableList<AnswerEntity> = mutableListOf()

      for (answerId in answersIds) {
        val maybeAnswerDb = questionMetadataAnswersDb.find { answerDb -> answerDb.id() == answerId }
        if (maybeAnswerDb == null) {
          return Either.left(UnexpectedAction("Answer not found: $answerId"))
        }
        answersDb.add(maybeAnswerDb)
      }

      userAnswers +=
        UserQuestionAnswerEntity().apply {
          question = questionMetadataDb
          answers = answersDb
        }
    }

    val userAnswersDb =
      when (
        val result: Either<ServiceIssue, MutableList<UserQuestionAnswerEntity>> =
          userQuestionAnswerRepository.sqlAction { saveAll(userAnswers) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    testDb.questionAnswers = userAnswersDb
    testDb.active = false
    val toReturn =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          userTestRepository.sqlAction { saveAndFlush(testDb) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    return Either.right(toReturn)
  }

  private fun deactivateExpired() {
    val toCheck: List<ImmutableTestEntity> =
      when (
        val result: Either<ServiceIssue, List<ImmutableTestEntity>> =
          immutableTestRepository.sqlAction { findAllByExpiresAfterNotNullAndActive(true) }
      ) {
        is Either.Left -> {
          log.error("Failed to get expired tests: ${result.value}")
          return
        }
        is Either.Right -> result.value
      }

    for (test in toCheck) {
      if (test.expiresAfter != null && test.expiresAfter!!.isBefore(LocalDateTime.now())) {
        test.active = false
        when (
          val result: Either<ServiceIssue, ImmutableTestEntity> =
            immutableTestRepository.sqlAction { saveAndFlush(test) }
        ) {
          is Either.Left -> log.error("Failed to deactivate expired test: ${result.value}")
          is Either.Right -> {}
        }

        test.userTests.forEach { userTest ->
          userTest.active = false
          when (
            val result: Either<ServiceIssue, UserTestEntity> =
              userTestRepository.sqlAction { saveAndFlush(userTest) }
          ) {
            is Either.Left ->
              log.error("Failed to deactivate expired test for user: ${result.value}")
            is Either.Right -> {}
          }
        }
      }
    }
  }

  private fun findTestForUser(user: User, testId: UUID): Either<ServiceIssue, UserTestEntity> {
    val userTestEntityDb =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          userTestRepository.sqlOptionalAction { findById(testId) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    if (userTestEntityDb.user().id() != user.id()) {
      return Either.left(UnexpectedAction("User test not found for user: ${user.id()}"))
    }

    return Either.right(userTestEntityDb)
  }

  data class UserAnswerParams(
    val testId: UUID,
    // questionMetadataId -> list[answerId]
    val answers: Map<UUID, List<UUID>>
  )

  private fun toAnswerEntity(from: Answer, questionEntity: QuestionEntity): AnswerEntity {
    return AnswerEntity().apply {
      question = questionEntity
      answer = from.text
      taskId = from.executorTaskId.value
    }
  }
}
