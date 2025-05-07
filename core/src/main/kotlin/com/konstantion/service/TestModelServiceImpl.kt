package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.TestModelEntity
import com.konstantion.entity.UserEntity
import com.konstantion.model.Role
import com.konstantion.port.QuestionPort
import com.konstantion.port.TestModelPort
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import java.time.Instant
import java.util.UUID
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
data class TestModelServiceImpl(
  private val testPort: TestModelPort<TestModelEntity>,
  private val questionPort: QuestionPort<QuestionEntity>
) : TestModelService {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  override fun getTestModelById(user: UserEntity, id: UUID): Either<ServiceIssue, TestModelEntity> {
    log.info("GetTestModelById[userId={}, username={}, id={}]", user.id(), user.username(), id)
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> {
        testPort
          .sqlAction { findById(id).asMaybe() }
          .flatMap { maybeTest ->
            when (maybeTest) {
              is Maybe.Just -> {
                val test = maybeTest.value
                if (test.creator?.id() == user.id() || user.isAdmin()) {
                  Either.right(test)
                } else {
                  Forbidden.asEither("User is not allowed to get test model.")
                }
              }
              Maybe.None -> Either.left(UnexpectedAction("Test model not found: $id"))
            }
          }
      }
      Role.Student -> Forbidden.asEither("User is not allowed to get test models.")
    }
  }

  override fun getTestModels(user: UserEntity): Either<ServiceIssue, List<TestModelEntity>> {
    log.info("GetTestModels[userId={}, username={}]", user.id(), user.username())
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> testPort.sqlAction { findAllByCreatorId(user.id()) }
      Role.Student -> Forbidden.asEither("User is not allowed to get test models.")
    }
  }

  override fun getAllTestModels(user: UserEntity): Either<ServiceIssue, List<TestModelEntity>> {
    log.info("GetAllTestModels[userId={}, username={}]", user.id(), user.username())
    return when (user.role()) {
      Role.Admin -> testPort.sqlAction { findAll() }
      Role.Teacher,
      Role.Student -> Forbidden.asEither("User is not allowed to get test models.")
    }
  }

  override fun createTestModel(
    user: UserEntity,
    params: TestModelService.CreateTestModelParams
  ): Either<ServiceIssue, TestModelEntity> {
    log.info(
      "CreateTestModel[userId={}, username={}, params={}]",
      user.id(),
      user.username(),
      params
    )
    return if (user.isAdmin() || user.isTeacher()) {
      val toSave =
        TestModelEntity().apply {
          name = params.name
          createdAt = Instant.now()
          creator = user
        }

      when (
        val result: Either<ServiceIssue, TestModelEntity> = testPort.sqlAction { save(toSave) }
      ) {
        is Either.Left -> {
          log.error("Failed to save test model: {}", result.value)
          result
        }
        is Either.Right -> {
          log.info(
            "CreateTestModel[userId={}, username={}, result={}]",
            user.id(),
            user.username(),
            result.value
          )
          result
        }
      }
    } else {
      Forbidden.asEither("User is not allowed to save test models.")
    }
  }

  override fun updateTestModel(
    user: UserEntity,
    id: UUID,
    params: TestModelService.UpdateTestModelParams
  ): Either<ServiceIssue, TestModelService.UpdateResult> {
    log.info(
      "UpdateTestModel[userId={}, username={}, id={}, params={}]",
      user.id(),
      user.username(),
      id,
      params
    )
    return if (user.isAdmin() || user.isTeacher()) {
      testPort
        .sqlAction { findById(id).asMaybe() }
        .flatMap { maybeTest ->
          when (maybeTest) {
            is Maybe.Just -> {
              val test = maybeTest.value
              if (test.creator?.id() == user.id() || user.isAdmin()) {
                val violations: MutableMap<String, MutableList<String>> = mutableMapOf()
                if (params.name != null) {
                  when {
                    params.name.isBlank() ->
                      violations
                        .computeIfAbsent("name") { mutableListOf() }
                        .add("Name cannot be blank.")
                    params.name.length > 255 ->
                      violations
                        .computeIfAbsent("name") { mutableListOf() }
                        .add("Name cannot be longer than 255 characters.")
                    else -> test.name = params.name
                  }
                }

                if (params.questionId != null) {
                  when (
                    val findResult: Either<ServiceIssue, Maybe<QuestionEntity>> =
                      questionPort.sqlAction { findById(params.questionId).asMaybe() }
                  ) {
                    is Either.Left ->
                      violations
                        .computeIfAbsent("questionId") { mutableListOf() }
                        .add("Failed to find question with id ${params.questionId}.")
                    is Either.Right -> {
                      val maybeQuestion = findResult.value
                      if (maybeQuestion is Maybe.Just) {
                        val question = maybeQuestion.value
                        if (params.action == TestModelService.UpdateTestModelParams.Action.ADD) {
                          test.questions.add(question)
                        } else {
                          test.questions.remove(question)
                        }
                      } else {
                        violations
                          .computeIfAbsent("questionId") { mutableListOf() }
                          .add("Failed to find question with id ${params.questionId}.")
                      }
                    }
                  }
                }

                when (
                  val saveResult: Either<ServiceIssue, TestModelEntity> =
                    testPort.sqlAction { save(test) }
                ) {
                  is Either.Left -> {
                    log.error("Failed to save test model: {}", saveResult.value)
                    Either.left(saveResult.value)
                  }
                  is Either.Right -> {
                    log.info(
                      "UpdateTestModel[userId={}, username={}, result={}]",
                      user.id(),
                      user.username(),
                      saveResult.value
                    )
                    Either.right(TestModelService.UpdateResult(saveResult.value, violations))
                  }
                }
              } else {
                Forbidden.asEither("User is not allowed to update test model.")
              }
            }
            Maybe.None -> Either.left(UnexpectedAction("Test model not found: $id"))
          }
        }
    } else {
      Forbidden.asEither("User is not allowed to update test models.")
    }
  }

  override fun deleteTestModel(user: UserEntity, id: UUID): Either<ServiceIssue, TestModelEntity> {
    log.info("DeleteTestModel[userId={}, username={}, id={}]", user.id(), user.username(), id)

    val maybeTestModel = testPort.sqlAction { findById(id).asMaybe() }

    return maybeTestModel.flatMap { maybeTest ->
      when (maybeTest) {
        is Maybe.Just -> {
          val testModel = maybeTest.value
          if (testModel.creator?.id() == user.id() || user.isAdmin()) {
            when (val result: Either<ServiceIssue, Unit> = testPort.sqlAction { deleteById(id) }) {
              is Either.Left -> Either.left(result.value)
              is Either.Right -> Either.right(testModel)
            }
          } else {
            log.warn(
              "User {} attempted to delete test model {} without permission.",
              user.id(),
              id
            )
            Forbidden.asEither("User is not allowed to delete this test model.")
          }
        }
        Maybe.None -> {
          log.warn("Attempted to delete non-existent test model id={}", id)
          Either.left(UnexpectedAction("Test model not found: $id"))
        }
      }
    }
  }
  }
