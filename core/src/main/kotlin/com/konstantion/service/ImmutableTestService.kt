package com.konstantion.service

import com.konstantion.entity.CodeEntity
import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.ImmutableTestStatus
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.TestModelEntity
import com.konstantion.entity.UserEntity
import com.konstantion.entity.UserTestEntity
import com.konstantion.entity.UserTestStatus
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
import com.konstantion.utils.CommonScheduler
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import com.konstantion.utils.TransactionsHelper
import jakarta.annotation.PostConstruct
import java.time.Duration
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
  private val transactionHelper: TransactionsHelper,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  @PostConstruct
  fun scheduleTasks() {
    log.info("Scheduling background tasks for ImmutableTestService")
    CommonScheduler.loopWithDelay(Duration.ofSeconds(15)) {
      transactionHelper.tx(::expireTestsTask)
    }
    log.info("Scheduled expireTestsTask to run every 30 seconds")
  }

  fun expireTestsTask(): Either<ServiceIssue, Unit> {
    val now = Instant.now()
    log.debug("Running expireTestsTask at {}", now)

    val expiredTestsResult: Either<ServiceIssue, List<ImmutableTestEntity>> =
      immutableTestRepository.sqlAction {
        findByStatusAndExpiresAfterBefore(ImmutableTestStatus.ACTIVE, now)
      }

    val expiredTests =
      when (expiredTestsResult) {
        is Either.Left -> {
          log.error("Failed to query for expired tests: {}", expiredTestsResult.value.message())
          return Either.left(expiredTestsResult.value)
        }
        is Either.Right -> expiredTestsResult.value
      }

    if (expiredTests.isEmpty()) {
      log.debug("No active tests found past their expiration time.")
      return Either.right(Unit)
    }

    log.info("Found {} active tests past their expiration time. Processing...", expiredTests.size)

    val userTestsToExpire = mutableListOf<UserTestEntity>()

    expiredTests.forEach { immutableTest ->
      log.info(
        "Processing expired test ID: {}, Name: '{}', Expires: {}",
        immutableTest.id(),
        immutableTest.name(),
        immutableTest.expiresAfter,
      )

      val testsInProgress =
        immutableTest.userTests().filter { userTest ->
          userTest.status() == UserTestStatus.IN_PROGRESS ||
            userTest.status() == UserTestStatus.NOT_STARTED
        }

      if (testsInProgress.isNotEmpty()) {
        log.info(
          "Found {} IN_PROGRESS user tests for expired test {}. Marking as EXPIRED.",
          testsInProgress.size,
          immutableTest.id(),
        )
        testsInProgress.forEach { userTest ->
          userTest.status = UserTestStatus.EXPIRED
          userTest.completedAt = immutableTest.expiresAfter
          userTestsToExpire.add(userTest)
        }
      }
      immutableTest.status = ImmutableTestStatus.ARCHIVED
      log.info("Marking ImmutableTest {} as ARCHIVED.", immutableTest.id())

      if (userTestsToExpire.isNotEmpty()) {
        when (
          val saveUserTestsResult: Either<ServiceIssue, MutableList<UserTestEntity>> =
            userTestRepository.sqlAction { saveAllAndFlush(userTestsToExpire) }
        ) {
          is Either.Left -> {
            log.error("Failed to save expired user tests: {}", saveUserTestsResult.value.message())

            return Either.left(saveUserTestsResult.value)
          }
          is Either.Right ->
            log.info("Successfully marked {} user tests as EXPIRED.", userTestsToExpire.size)
        }
      }
    }

    when (
      val saveImmutableTestsResult: Either<ServiceIssue, MutableList<ImmutableTestEntity>> =
        immutableTestRepository.sqlAction { saveAllAndFlush(expiredTests) }
    ) {
      is Either.Left -> {
        log.error(
          "Failed to save archived immutable tests: {}",
          saveImmutableTestsResult.value.message(),
        )
        return Either.left(saveImmutableTestsResult.value)
      }
      is Either.Right ->
        log.info("Successfully marked {} immutable tests as ARCHIVED.", expiredTests.size)
    }
    log.debug("Finished expireTestsTask run.")
    return Either.right(Unit)
  }

  fun findAll(user: UserEntity): Either<ServiceIssue, List<ImmutableTestEntity>> {
    log.info(
      "FindAll[userId={}, username={}]",
      user.id(),
      user.username(),
    )

    if (!user.isAdmin()) {
      return Forbidden.asEither("User is not allowed to find immutable tests.")
    }

    return when (
      val result: Either<ServiceIssue, List<ImmutableTestEntity>> =
        immutableTestRepository.sqlAction { findAll() }
    ) {
      is Either.Left -> Either.left(result.value)
      is Either.Right -> Either.right(result.value)
    }
  }

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

  fun findById(
    user: UserEntity,
    id: UUID,
  ): Either<ServiceIssue, ImmutableTestEntity> {
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
        if (test.creator?.id() == user.id() || user.isAdmin()) {
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

    if (createParams.name.isBlank()) {
      return Either.left(UnexpectedAction("Immutable test name cannot be blank."))
    }

    if (createParams.name.length > 100) {
      return Either.left(UnexpectedAction("Immutable test name cannot exceed 100 characters."))
    }

    if (user.isStudent()) {
      return Forbidden.asEither("User is not allowed to create immutable test.")
    }

    val (testModelId, name, expiresAfterParam, shuffleQuestionsParam, shuffleVariantsParam) =
      createParams
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
        this.name = name
        this.status = ImmutableTestStatus.ACTIVE
        this.createdAt = Instant.now()
        this.questions = deepClone.questions
        this.creator = userEntity
        this.expiresAfter = expiresAfterInstant
        this.shuffleVariants = shuffleVariantsParam
        this.shuffleQuestions = shuffleQuestionsParam
      }

    val immutableEntity = immutableTestRepository.saveAndFlush(immutableTest)
    return Either.right(immutableEntity)
  }

  fun archiveTest(
    user: UserEntity,
    id: UUID,
  ): Either<ServiceIssue, ImmutableTestEntity> {
    log.info("ArchiveTest[userId={}, username={}, id={}]", user.id(), user.username(), id)

    if (user.isStudent()) {
      return Forbidden.asEither("Students cannot archive tests.")
    }

    val immutableTestResult: Either<ServiceIssue, ImmutableTestEntity> =
      immutableTestRepository.sqlOptionalAction { findById(id) }
    val immutableTest =
      when (immutableTestResult) {
        is Either.Left -> return Either.left(immutableTestResult.value)
        is Either.Right -> immutableTestResult.value
      }

    if (!user.isAdmin() && immutableTest.creator?.id() != user.id()) {
      log.warn("User {} permission denied to archive ImmutableTest {}", user.id(), id)
      return Forbidden.asEither("User does not have permission to archive this test.")
    }

    if (immutableTest.status() == ImmutableTestStatus.ARCHIVED) {
      return Either.left(UnexpectedAction("Test is already archived: $id"))
    }

    val now = Instant.now()
    val userTestsToCancel =
      userTestRepository.findAll().filter {
        it.immutableTest().id() == id && it.status() == UserTestStatus.IN_PROGRESS
      }

    if (userTestsToCancel.isNotEmpty()) {
      log.info(
        "Archiving test {}: Found {} IN_PROGRESS user tests to cancel.",
        id,
        userTestsToCancel.size,
      )
      userTestsToCancel.forEach { userTest ->
        userTest.status = UserTestStatus.CANCELLED
        userTest.completedAt = now
      }

      when (
        val saveUserTestsResult: Either<ServiceIssue, MutableList<UserTestEntity>> =
          userTestRepository.sqlAction { saveAllAndFlush(userTestsToCancel) }
      ) {
        is Either.Left -> {
          log.error(
            "Failed to update user tests status during archive for immutable test {}: {}",
            id,
            saveUserTestsResult.value,
          )

          return Either.left(saveUserTestsResult.value)
        }
        is Either.Right ->
          log.info(
            "Successfully cancelled {} IN_PROGRESS user tests for archived test {}",
            userTestsToCancel.size,
            id,
          )
      }
    } else {
      log.info("Archiving test {}: No IN_PROGRESS user tests found to cancel.", id)
    }

    immutableTest.status = ImmutableTestStatus.ARCHIVED

    return immutableTestRepository
      .sqlAction { saveAndFlush(immutableTest) }
      .ifLeft { log.error("Failed to archive immutable test {}: {}", id, it) }
      .ifRight { log.info("Successfully archived ImmutableTest: {}", it.id()) }
  }

  fun findByIdNotArchived(id: UUID): Either<ServiceIssue, Maybe<ImmutableTestEntity>> {
    log.info("FindByIdNotArchived[id={}]", id)

    return immutableTestRepository
      .sqlOptionalAction { findById(id) }
      .flatMap { immutableTest ->
        if (immutableTest.status == ImmutableTestStatus.ARCHIVED) {
          log.warn("Immutable test {} is archived, cannot be found.", id)
          Either.right(Maybe.none())
        } else {
          Either.right(Maybe.just(immutableTest))
        }
      }
  }

  private fun deepCloneTestModel(original: TestModelEntity): TestModelEntity {
    val clone =
      TestModelEntity().apply {
        name = original.name
        createdAt = Instant.now()
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
    val name: String,
    val expiresAfter: Long?,
    val shuffleQuestions: Boolean,
    val shuffleVariants: Boolean,
  )
}
