package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.executor.QuestionExecutor
import com.konstantion.model.Lang
import com.konstantion.model.Permission
import com.konstantion.model.Question
import com.konstantion.model.Role
import com.konstantion.model.User
import com.konstantion.port.QuestionPort
import com.konstantion.service.QuestionService.ValidationId
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import kotlinx.serialization.json.Json
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.UUID
import java.util.concurrent.locks.Lock
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

@Service
data class QuestionServiceImpl(
  private val questionPort: QuestionPort<QuestionEntity>,
  private val pythonExecutor: QuestionExecutor<Lang.Python>,
) : QuestionService<QuestionEntity> {
  private val log: Logger = LoggerFactory.getLogger(QuestionServiceImpl::class.java)
  private val sqlLock: Lock = ReentrantLock()
  private val questionValidator: QuestionValidator =
    QuestionValidator(sqlLock, questionPort, pythonExecutor)

  override fun save(
    user: User,
    question: Question<Lang>
  ): Either<ServiceIssue, QuestionEntity> {
    log.info("Save[userId={}, username={}, question={}]", user.id(), user.getUsername(), question)

    return if (user.isAdmin() || user.hasPermission(Permission.SaveQuestion)) {
      val saveResult = sqlAction { questionPort.save(QuestionEntity.fromModel(question)) }
      log.info(
        "SaveResult[userId={}, username={}, result={}]",
        user.id(),
        user.getUsername(),
        saveResult
      )
      return saveResult
    } else {
      Forbidden.asEither("User is not allowed to save questions.")
    }
  }

  override fun getQuestions(user: User): Either<ServiceIssue, List<QuestionEntity>> {
    log.info("GetQuestions[userId={}, username={}]", user.id(), user.getUsername())
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> sqlAction { questionPort.findAllByCreatorId(user.id()) }
      Role.Student -> Forbidden.asEither("User is not allowed to get questions.")
    }
  }

  override fun getAllQuestion(user: User): Either<ServiceIssue, List<QuestionEntity>> {
    log.info("GetAllQuestion[userId={}, username={}]", user.id(), user.getUsername())
    return when (user.role()) {
      Role.Admin -> sqlAction { questionPort.findAll() }
      Role.Student,
      Role.Teacher -> Forbidden.asEither("User is not allowed to get all questions.")
    }
  }

  override fun getPublicQuestions(user: User): Either<ServiceIssue, List<QuestionEntity>> {
    log.info("GetPublicQuestions[userId={}, username={}]", user.id(), user.getUsername())
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> sqlAction { questionPort.findAllByPublic(true) }
      Role.Student -> Forbidden.asEither("User is not allowed to get public questions.")
    }
  }

  override fun getQuestion(user: User, id: UUID): Either<ServiceIssue, QuestionEntity> {
    log.info("GetQuestion[userId={}, username={}, id={}]", user.id(), user.getUsername(), id)
    return when (user.role()) {
      Role.Admin ->
        sqlAction {
          when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.findById(id).asMaybe()) {
            is Maybe.Just -> maybeQuestion.value
            Maybe.None -> throw NotExistsException("Question not found.")
          }
        }
      Role.Teacher -> {
        sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.findById(id).asMaybe()) {
              is Maybe.Just -> maybeQuestion.value
              Maybe.None -> throw NotExistsException("Question not found.")
            }
          }
          .flatMap { question ->
            if (question?.creator?.id != user.id()) {
              Forbidden.asEither("User is not allowed to get this question.")
            } else {
              Either.right(question)
            }
          }
      }
      Role.Student -> Forbidden.asEither("User is not allowed to get questions.")
    }
  }

  override fun createQuestion(
    user: User,
    params: QuestionService.CreateQuestionParams
  ): Either<ServiceIssue, QuestionEntity> {
    log.info(
      "CreateQuestion[userId={}, username={}, params={}]",
      user.id(),
      user.getUsername(),
      params
    )
    return if (user.isAdmin() || user.hasPermission(Permission.CreateQuestion)) {
      val entity: QuestionEntity =
        QuestionEntity().apply {
          lang = Json.encodeToString(Lang.serializer(), params.lang)
          body = params.body
          // TODO: add creator
        }
      val toReturn = questionPort.save(entity)
      log.info(
        "CreateQuestionSuccess[userId={}, username={}, result={}]",
        user.id(),
        user.getUsername(),
        toReturn
      )
      Either.right(toReturn)
    } else {
      Forbidden.asEither("User is not allowed to create questions.")
    }
  }

  override fun updateQuestion(
    user: User,
    id: UUID,
    params: QuestionService.UpdateQuestionParams
  ): Either<ServiceIssue, QuestionEntity> {
    TODO()
  }

  override fun deleteQuestion(user: User, id: UUID): Either<ServiceIssue, QuestionEntity> {
    log.info("DeleteQuestion[userId={}, username={}, id={}]", user.id(), user.getUsername(), id)
    return when (user.role()) {
      Role.Admin ->
        sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.findById(id).asMaybe()) {
              is Maybe.Just -> maybeQuestion.value
              Maybe.None -> throw NotExistsException("Question not found.")
            }
          }
          .flatMap { question: QuestionEntity ->
            sqlAction {
              questionPort.deleteById(question.id())
              question
            }
          }
      Role.Teacher -> {
        sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.findById(id).asMaybe()) {
              is Maybe.Just -> maybeQuestion.value
              Maybe.None -> throw NotExistsException("Question not found.")
            }
          }
          .flatMap { question: QuestionEntity ->
            if (question.creator?.id != user.id()) {
              Forbidden.asEither("User is not allowed to delete this question.")
            } else {
              sqlAction {
                questionPort.deleteById(question.id())
                question
              }
            }
          }
      }
      Role.Student -> Forbidden.asEither("User is not allowed to delete questions.")
    }
  }

  override fun validateQuestion(user: User, id: UUID): Either<ServiceIssue, ValidationId> {
    log.info("ValidateQuestion[userId={}, username={}, id={}]", user.id(), user.getUsername(), id)
    return getQuestion(user, id).flatMap(questionValidator::validate).map(::ValidationId)
  }

  override fun validationStatus(
    user: User,
    id: UUID
  ): Either<ServiceIssue, QuestionService.StatusResponse> {
    log.info("ValidationStatus[userId={}, username={}, id={}]", user.id(), user.getUsername(), id)
    return getQuestion(user, id).map { question -> questionValidator.status(question.id()) }
  }

  private fun <T : Any> sqlAction(action: () -> T): Either<ServiceIssue, T> =
    sqlLock.withLock {
      try {
        Either.right(action())
      } catch (dbIssue: Exception) {
        log.error("SqlError[message={}]", dbIssue.message)
        Either.left(SqlError(dbIssue.message ?: "Unknown error"))
      }
    }
}
