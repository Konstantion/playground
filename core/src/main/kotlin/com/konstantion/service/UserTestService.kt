package com.konstantion.service

import com.konstantion.entity.AnswerEntity
import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.ImmutableTestStatus
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.QuestionMetadataEntity
import com.konstantion.entity.TestMetadataEntity
import com.konstantion.entity.UserEntity
import com.konstantion.entity.UserQuestionAnswerEntity
import com.konstantion.entity.UserTestEntity
import com.konstantion.entity.UserTestStatus
import com.konstantion.executor.TestModelExecutor
import com.konstantion.model.Answer
import com.konstantion.model.TestModel
import com.konstantion.model.TestModelMetadata
import com.konstantion.repository.AnswerRepository
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
import com.konstantion.utils.CommonScheduler
import com.konstantion.utils.Either
import java.time.Duration
import java.time.Instant
import java.util.UUID
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
  private val answerRepository: AnswerRepository,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  init {
    CommonScheduler.loopWithDelay(
      delay = Duration.ofMinutes(5),
      block = ::deactivateExpiredUserTests,
    )
  }

  fun createTestForUser(
    targetUser: UserEntity,
    immutableTestId: UUID,
  ): Either<ServiceIssue, UserTestEntity> {
    log.info(
      "CreateUserTest[userId={}, username={}, immutableTestModelId={}]",
      targetUser.id(),
      targetUser.username(),
      immutableTestId,
    )

    val immutableTestEntityDb =
      when (
        val result: Either<ServiceIssue, ImmutableTestEntity> =
          immutableTestRepository.sqlOptionalAction { findById(immutableTestId) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    if (immutableTestEntityDb.status() != ImmutableTestStatus.ACTIVE) {
      return Either.left(UnexpectedAction("Immutable test is not active: $immutableTestId"))
    }
    if (
      immutableTestEntityDb.expiresAfter != null &&
        immutableTestEntityDb.expiresAfter!!.isBefore(Instant.now())
    ) {
      return Either.left(UnexpectedAction("Immutable test is expired: $immutableTestId"))
    }
    if (immutableTestEntityDb.userTests.any { test -> test.user().id() == targetUser.id() }) {
      return Either.left(
        UnexpectedAction(
          "User test already exists for user ${targetUser.id()} and immutable test $immutableTestId",
        ),
      )
    }
    if (immutableTestEntityDb.questions().isEmpty()) {
      return Either.left(
        UnexpectedAction(
          "Cannot create test: Immutable test model has no questions: $immutableTestId",
        ),
      )
    }

    var questionsToProcess = immutableTestEntityDb.questions().toList()
    if (immutableTestEntityDb.shuffleQuestions()) {
      questionsToProcess = questionsToProcess.shuffled()
    }

    val testModel =
      TestModel(
        id = immutableTestEntityDb.id(),
        name = immutableTestEntityDb.name(),
        questions = questionsToProcess.map { it.toModel() }, // Use potentially shuffled list
      )
    val generatedMetadata: TestModelMetadata =
      when (
        val executorResult: Either<TestModelExecutor.Issue, TestModelMetadata> =
          testModelExecutor.run(testModel)
      ) {
        is Either.Left ->
          return Either.left(
            UnexpectedAction(
              "Test model execution failed: ${testModel.id}, Issue: ${executorResult.value}",
            ),
          )
        is Either.Right -> executorResult.value
      }

    val idToQuestionEntityMap = immutableTestEntityDb.questions().associateBy { it.id() }
    val allAnswersToPersist = mutableListOf<AnswerEntity>()

    val transientQuestionMetadataList =
      generatedMetadata.questionMetadatas.map { generatedQuestionMetadata ->
        val originalQuestionEntity =
          idToQuestionEntityMap[generatedQuestionMetadata.questionIdentifier]
            ?: return Either.left(
              SqlError(
                "Consistency error: Original question ${generatedQuestionMetadata.questionIdentifier} not found in ImmutableTest ${immutableTestEntityDb.id()}",
              ),
            )

        var currentCorrectAnswersDto = generatedQuestionMetadata.correctAnswers
        var currentIncorrectAnswersDto = generatedQuestionMetadata.incorrectAnswers

        if (immutableTestEntityDb.shuffleVariants()) {
          currentCorrectAnswersDto = currentCorrectAnswersDto.shuffled()
          currentIncorrectAnswersDto = currentIncorrectAnswersDto.shuffled()
        }

        val transientCorrectAnswers =
          currentCorrectAnswersDto.map { answerDto ->
            toAnswerEntity(answerDto, originalQuestionEntity)
          }
        val transientIncorrectAnswers =
          currentIncorrectAnswersDto.map { answerDto ->
            toAnswerEntity(answerDto, originalQuestionEntity)
          }

        allAnswersToPersist.addAll(transientCorrectAnswers)
        allAnswersToPersist.addAll(transientIncorrectAnswers)

        generatedQuestionMetadata to (transientCorrectAnswers + transientIncorrectAnswers)
      }

    val persistedAnswersResult: Either<ServiceIssue, MutableList<AnswerEntity>> =
      answerRepository.sqlAction { saveAllAndFlush(allAnswersToPersist) }
    val persistedAnswers =
      when (persistedAnswersResult) {
        is Either.Left -> {
          log.error("Failed to save answers in bulk: {}", persistedAnswersResult.value)
          return Either.left(persistedAnswersResult.value)
        }
        is Either.Right -> persistedAnswersResult.value
      }
    val taskIdToPersistedAnswerMap = persistedAnswers.associateBy { it.taskId }

    val testMetadataToSave =
      TestMetadataEntity().apply {
        val testMetadata = this@apply
        this.immutableTestEntity = immutableTestEntityDb
        this.name = generatedMetadata.name
        this.questionMetadata =
          transientQuestionMetadataList
            .map { (questionMetadataDto, transientAnswersForDto) ->
              val originalQuestionEntity =
                idToQuestionEntityMap[questionMetadataDto.questionIdentifier]!!

              val persistedAnswersForDto =
                transientAnswersForDto.mapNotNull { transientAnswer ->
                  taskIdToPersistedAnswerMap[transientAnswer.taskId]
                }
              if (persistedAnswersForDto.size != transientAnswersForDto.size) {
                log.error(
                  "Mismatch between transient ({}) and persisted ({}) answers for question metadata {}",
                  transientAnswersForDto.size,
                  persistedAnswersForDto.size,
                  questionMetadataDto.questionIdentifier,
                )
              }

              val correctPersisted =
                persistedAnswersForDto
                  .filter { persistedAnswer ->
                    questionMetadataDto.correctAnswers.any {
                      it.executorTaskId.value == persistedAnswer.taskId
                    }
                  }
                  .toMutableList()

              val incorrectPersisted =
                persistedAnswersForDto
                  .filter { persistedAnswer ->
                    questionMetadataDto.incorrectAnswers.any {
                      it.executorTaskId.value == persistedAnswer.taskId
                    }
                  }
                  .toMutableList()

              QuestionMetadataEntity().apply {
                this.testMetadata = testMetadata
                this.question = originalQuestionEntity
                this.text = questionMetadataDto.text
                this.formatAndCode = Json.encodeToString(questionMetadataDto.formatAndCode)
                this.correctAnswers = correctPersisted
                this.incorrectAnswers = incorrectPersisted
              }
            }
            .toMutableList()
      }

    val testMetadataDb =
      when (
        val result: Either<ServiceIssue, TestMetadataEntity> =
          testMetadataRepository.sqlAction { saveAndFlush(testMetadataToSave) }
      ) {
        is Either.Left -> {
          log.error("Failed to save test metadata: {}", result.value)
          return Either.left(result.value)
        }
        is Either.Right -> result.value
      }

    val userTestEntityToSave =
      UserTestEntity().apply {
        this.immutableTest = immutableTestEntityDb
        this.testMetadata = testMetadataDb
        this.user = targetUser
        this.questionAnswers = mutableListOf()
        this.status = UserTestStatus.NOT_STARTED
      }

    val userTestDb =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          userTestRepository.sqlAction { saveAndFlush(userTestEntityToSave) }
      ) {
        is Either.Left -> {
          log.error("Failed to save user test: {}", result.value)
          return Either.left(result.value)
        }
        is Either.Right -> result.value
      }

    val finalImmutableTest =
      when (
        val result: Either<ServiceIssue, ImmutableTestEntity> =
          immutableTestRepository.sqlOptionalAction { findById(immutableTestEntityDb.id()) }
      ) {
        is Either.Left -> {
          log.error("Failed to find immutable test after saving user test: {}", result.value)
          return Either.left(result.value)
        }
        is Either.Right -> result.value
      }

    finalImmutableTest.userTests.add(userTestDb)
    when (val result = immutableTestRepository.sqlAction { saveAndFlush(finalImmutableTest) }) {
      is Either.Left -> {
        log.error(
          "Failed to update immutable test {} with user test reference {}: {}",
          finalImmutableTest.id(),
          userTestDb.id(),
          result.value,
        )
        return Either.left(result.value)
      }
      else -> {}
    }

    log.info("Successfully created UserTest: {}", userTestDb.id())
    return Either.right(userTestDb)
  }

  fun startTest(
    user: UserEntity,
    userTestId: UUID,
  ): Either<ServiceIssue, UserTestEntity> {
    log.info("StartTest[userId={}, userTestId={}]", user.id(), userTestId)

    val userTest =
      when (val result = findTestForUser(user, userTestId)) {
        is Either.Left -> return result
        is Either.Right -> result.value
      }

    if (userTest.status != UserTestStatus.NOT_STARTED) {
      return Either.left(
        UnexpectedAction("Test cannot be started. Current status: ${userTest.status}"),
      )
    }

    val immutableTest = userTest.immutableTest()
    if (
      immutableTest.expiresAfter != null && immutableTest.expiresAfter!!.isBefore(Instant.now())
    ) {
      userTest.status = UserTestStatus.EXPIRED
      userTest.completedAt = Instant.now()
      return userTestRepository
        .sqlAction { saveAndFlush(userTest) }
        .flatMap { Either.left(UnexpectedAction("Test has expired and cannot be started.")) }
    }

    userTest.status = UserTestStatus.IN_PROGRESS
    userTest.startedAt = Instant.now()

    return userTestRepository
      .sqlAction { saveAndFlush(userTest) }
      .ifLeft {
        log.error("Failed to update UserTest status to IN_PROGRESS for id {}: {}", userTestId, it)
      }
  }

  fun getTestForUser(
    targetUser: UserEntity,
    userTestId: UUID,
  ): Either<ServiceIssue, UserTestEntity> {
    log.info(
      "GetUserTest[userId={}, username={}, userTestId={}]",
      targetUser.id(),
      targetUser.username(),
      userTestId,
    )
    return findTestForUser(targetUser, userTestId)
  }

  fun getTestsForUser(user: UserEntity): Either<ServiceIssue, List<UserTestEntity>> {
    log.info("GetTestsForUser[userId={}, username={}]", user.id(), user.username())
    return userTestRepository
      .sqlAction { findByUserId(user.id()) }
      .ifLeft { issue -> log.error("Failed to get tests for user {}: {}", user.id(), issue) }
  }

  fun submitUserAnswer(
    targetUser: UserEntity,
    params: UserAnswerParams,
  ): Either<ServiceIssue, UserTestEntity> {
    log.info(
      "SubmitUserAnswer[userId={}, username={}, userTestId={}]",
      targetUser.id(),
      targetUser.username(),
      params.testId,
    )

    if (!targetUser.isStudent()) {
      return Either.left(Forbidden("Only students can submit answers."))
    }

    val testDb: UserTestEntity =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          findTestForUser(targetUser, params.testId)
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    if (testDb.status != UserTestStatus.IN_PROGRESS) {
      return Either.left(
        UnexpectedAction(
          "Test ${params.testId} is not in progress. Current status: ${testDb.status}",
        ),
      )
    }

    val immutableTest = testDb.immutableTest()
    if (
      immutableTest.expiresAfter != null && immutableTest.expiresAfter!!.isBefore(Instant.now())
    ) {
      testDb.status = UserTestStatus.EXPIRED
      testDb.completedAt = Instant.now()
      return userTestRepository
        .sqlAction { saveAndFlush(testDb) }
        .flatMap { Either.left(UnexpectedAction("Test submission failed: Time has expired.")) }
    }

    val userAnswersToSave: MutableList<UserQuestionAnswerEntity> = mutableListOf()
    val allAnswerIdsFromRequest = params.answers.values.flatten().toSet()

    val relatedAnswersDbMap =
      answerRepository.findAllById(allAnswerIdsFromRequest).associateBy { it.id() }

    for ((questionMetadataId, answerIdsFromRequest) in params.answers) {
      val questionMetadataDb: QuestionMetadataEntity =
        when (
          val result: Either<ServiceIssue, QuestionMetadataEntity> =
            questionMetadataRepository.sqlOptionalAction { findById(questionMetadataId) }
        ) {
          is Either.Left -> return Either.left(result.value)
          is Either.Right -> result.value
        }
      if (questionMetadataDb.testMetadata().id() != testDb.testMetadata().id()) {
        return Either.left(
          UnexpectedAction(
            "Question metadata $questionMetadataId does not belong to test metadata ${
                            testDb.testMetadata().id()
                        }",
          ),
        )
      }
      val validAnswerIdsForQuestion =
        questionMetadataDb.answers().map { answer -> answer.id() }.toSet()
      val submittedAnswersForQuestion: MutableList<AnswerEntity> = mutableListOf()
      for (submittedAnswerId in answerIdsFromRequest) {
        if (!validAnswerIdsForQuestion.contains(submittedAnswerId)) {
          return Either.left(
            UnexpectedAction(
              "Invalid answer ID $submittedAnswerId submitted for question metadata $questionMetadataId",
            ),
          )
        }
        val answerEntity =
          relatedAnswersDbMap[submittedAnswerId]
            ?: return Either.left(
              SqlError("Consistency error: Answer $submittedAnswerId not found after bulk fetch."),
            )
        submittedAnswersForQuestion.add(answerEntity)
      }
      userAnswersToSave +=
        UserQuestionAnswerEntity().apply {
          this.question = questionMetadataDb
          this.answers = submittedAnswersForQuestion
        }
    }
    val userAnswersDb =
      when (
        val result: Either<ServiceIssue, MutableList<UserQuestionAnswerEntity>> =
          userQuestionAnswerRepository.sqlAction { saveAllAndFlush(userAnswersToSave) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    testDb.questionAnswers().clear()
    testDb.questionAnswers().addAll(userAnswersDb)
    if (testDb.status != UserTestStatus.EXPIRED) {
      testDb.status = UserTestStatus.COMPLETED
      testDb.completedAt = Instant.now()
    }
    testDb.score = calculateScore(testDb)

    val updatedUserTest =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          userTestRepository.sqlAction { saveAndFlush(testDb) }
      ) {
        is Either.Left -> return Either.left(result.value)
        is Either.Right -> result.value
      }

    log.info(
      "UserTest {} submitted and completed successfully for user {}",
      updatedUserTest.id(),
      targetUser.id(),
    )
    return Either.right(updatedUserTest)
  }

  private fun calculateScore(userTest: UserTestEntity): Double {
    var correctCount = 0
    val totalQuestions = userTest.testMetadata().questionMetadata().size

    if (totalQuestions == 0) return 0.0

    val userAnswersMap = userTest.questionAnswers().associateBy { it.question().id() }

    userTest.testMetadata().questionMetadata().forEach { qm ->
      val userQuestionAnswer = userAnswersMap[qm.id()]
      if (userQuestionAnswer != null) {
        val userSelectedAnswerIds = userQuestionAnswer.answers().map { it.id() }.toSet()
        val correctAnswerIds = qm.correctAnswers().map { it.id() }.toSet()
        if (userSelectedAnswerIds == correctAnswerIds) {
          correctCount++
        }
      }
    }
    return (correctCount.toDouble() / totalQuestions.toDouble()) * 100.0
  }

  private fun deactivateExpiredUserTests() {
    val now = Instant.now()

    val potentiallyExpiredUserTests =
      try {
        userTestRepository.findAll().filter { test ->
          test.status == UserTestStatus.IN_PROGRESS &&
            test.immutableTest().expiresAfter != null &&
            test.immutableTest().expiresAfter!!.isBefore(now)
        }
      } catch (e: Exception) {
        log.error("Failed to query for potentially expired user tests", e)
        return
      }

    if (potentiallyExpiredUserTests.isEmpty()) {
      return
    }

    log.info(
      "Found {} IN_PROGRESS user tests whose time has expired. Marking as EXPIRED...",
      potentiallyExpiredUserTests.size,
    )

    potentiallyExpiredUserTests.forEach { userTest ->
      userTest.status = UserTestStatus.EXPIRED
      userTest.completedAt = userTest.immutableTest().expiresAfter

      try {
        userTestRepository.save(userTest)
        log.info("Marked UserTest id={} as EXPIRED.", userTest.id())
      } catch (e: Exception) {
        log.error("Failed to mark UserTest id={} as EXPIRED.", userTest.id(), e)
      }
    }
    try {
      userTestRepository.flush()
    } catch (e: Exception) {
      log.error("Error flushing repositories after marking user tests as expired", e)
    }
  }

  private fun findTestForUser(
    user: UserEntity,
    userTestId: UUID,
  ): Either<ServiceIssue, UserTestEntity> {
    val userTestEntityDb =
      when (
        val result: Either<ServiceIssue, UserTestEntity> =
          userTestRepository.sqlOptionalAction { findById(userTestId) }
      ) {
        is Either.Left ->
          return Either.left(
            SqlError(
              "UserTest with id $userTestId not found or DB error: ${result.value.message()}",
            ),
          )
        is Either.Right -> result.value
      }

    val isOwnerStudent = user.isStudent() && userTestEntityDb.user().id() == user.id()
    val isSourceCreator =
      !user.isStudent() && userTestEntityDb.immutableTest().creator()?.id() == user.id()

    if (!isOwnerStudent && !isSourceCreator) {
      log.warn("User {} permission denied for UserTest {}", user.id(), userTestId)
      return Either.left(Forbidden("User does not have permission to access this test instance."))
    }

    return Either.right(userTestEntityDb)
  }

  private fun toAnswerEntity(
    from: Answer,
    questionEntity: QuestionEntity,
  ): AnswerEntity =
    AnswerEntity().apply {
      this.question = questionEntity
      this.answer = from.text
      this.taskId = from.executorTaskId.value
    }

  data class UserAnswerParams(
    val testId: UUID,
    val answers: Map<UUID, List<UUID>>, // QuestionMetadataID to list of chosen AnswerIDs
  )
}
