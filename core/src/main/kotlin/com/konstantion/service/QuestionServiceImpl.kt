package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.UserEntity
import com.konstantion.executor.QuestionExecutor
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.Permission
import com.konstantion.model.Question
import com.konstantion.model.Role
import com.konstantion.port.QuestionPort
import com.konstantion.service.QuestionService.ValidationId
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import java.util.UUID
import kotlinx.serialization.json.Json.Default.encodeToString
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
data class QuestionServiceImpl(
  private val questionPort: QuestionPort<QuestionEntity>,
  private val pythonExecutor: QuestionExecutor<Lang.Python>,
  private val updateHelper: QuestionUpdateHelper,
  private val questionValidator: QuestionValidator,
) : QuestionService {
  private val log: Logger = LoggerFactory.getLogger(QuestionServiceImpl::class.java)

  override fun save(
    user: UserEntity,
    question: Question<Lang>
  ): Either<ServiceIssue, QuestionEntity> {
    log.info("Save[userId={}, username={}, question={}]", user.id(), user.username(), question)

    return if (user.isAdmin() || user.isTeacher() || user.hasPermission(Permission.SaveQuestion)) {
      val saveResult = questionPort.sqlAction { save(QuestionEntity.fromModel(question)) }
      log.info(
        "SaveResult[userId={}, username={}, result={}]",
        user.id(),
        user.username(),
        saveResult
      )
      return saveResult
    } else {
      Forbidden.asEither("User is not allowed to save questions.")
    }
  }

  override fun getQuestions(user: UserEntity): Either<ServiceIssue, List<QuestionEntity>> {
    log.info("GetQuestions[userId={}, username={}]", user.id(), user.username())
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> questionPort.sqlAction { findAllByCreatorId(user.id()) }
      Role.Student -> Forbidden.asEither("User is not allowed to get questions.")
    }
  }

  override fun getAllQuestion(user: UserEntity): Either<ServiceIssue, List<QuestionEntity>> {
    log.info("GetAllQuestion[userId={}, username={}]", user.id(), user.username())
    return when (user.role()) {
      Role.Admin -> questionPort.sqlAction { findAll() }
      Role.Student,
      Role.Teacher -> Forbidden.asEither("User is not allowed to get all questions.")
    }
  }

  override fun getPublicQuestions(user: UserEntity): Either<ServiceIssue, List<QuestionEntity>> {
    log.info("GetPublicQuestions[userId={}, username={}]", user.id(), user.username())
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> questionPort.sqlAction { findAllByPublic(true) }
      Role.Student -> Forbidden.asEither("User is not allowed to get public questions.")
    }
  }

  override fun getQuestion(user: UserEntity, id: UUID): Either<ServiceIssue, QuestionEntity> {
    log.info("GetQuestion[userId={}, username={}, id={}]", user.id(), user.username(), id)
    return when (user.role()) {
      Role.Admin ->
        questionPort.sqlAction {
          when (val maybeQuestion: Maybe<QuestionEntity> = findById(id).asMaybe()) {
            is Maybe.Just -> maybeQuestion.value
            Maybe.None -> throw NotExistsException("Question not found.")
          }
        }
      Role.Teacher -> {
        questionPort
          .sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = findById(id).asMaybe()) {
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
    user: UserEntity,
    params: QuestionService.CreateQuestionParams
  ): Either<ServiceIssue, QuestionEntity> {
    log.info(
      "CreateQuestion[userId={}, username={}, params={}]",
      user.id(),
      user.username(),
      params
    )
    return if (user.isAdmin() || user.hasPermission(Permission.CreateQuestion)) {
      val entity: QuestionEntity =
        QuestionEntity().apply {
          lang = encodeToString(Lang.serializer(), params.lang)
          body = params.body
          creator = user
          formatAndCode = FormatAndCode.emptyJson()
        }
      val toReturn = questionPort.save(entity)
      log.info(
        "CreateQuestionSuccess[userId={}, username={}, result={}]",
        user.id(),
        user.username(),
        toReturn
      )
      Either.right(toReturn)
    } else {
      Forbidden.asEither("User is not allowed to create questions.")
    }
  }

  override fun updateQuestion(
    user: UserEntity,
    id: UUID,
    params: QuestionService.UpdateQuestionParams
  ): Either<ServiceIssue, QuestionService.UpdateResult<QuestionEntity>> {
    log.info(
      "UpdateQuestion[userId={}, username={}, id={}, params={}]",
      user.id(),
      user.username(),
      id,
      params
    )

    return if (user.isAdmin() || user.hasPermission(Permission.UpdateQuestion)) {
      when (
        val result: Either<ServiceIssue, QuestionEntity> =
          questionPort
            .sqlAction { findById(id).asMaybe() }
            .flatMap { maybeQuestion ->
              when (maybeQuestion) {
                is Maybe.Just -> Either.right(maybeQuestion.value)
                Maybe.None -> Either.left(UnexpectedAction("Question with id $id not found."))
              }
            }
      ) {
        is Either.Left -> Either.left(result.value)
        is Either.Right -> {
          val entity: QuestionEntity = result.value
          log.info(
            "UpdateQuestion[userId={}, username={}, entity={}]",
            user.id(),
            user.username(),
            entity
          )
          val updateResult: UpdateResult = updateHelper.update(entity, params)
          if (updateResult.invalidate) {
            questionValidator.onInvalidated(entity)
          }

          val saved = questionPort.save(entity)

          log.info(
            "UpdateQuestionSuccess[userId={}, username={}, entity={}, violations={}]",
            user.id(),
            user.username(),
            saved,
            updateResult
          )
          Either.right(QuestionService.UpdateResult(saved, updateResult.violations))
        }
      }
    } else {
      Forbidden.asEither("User is not allowed to update questions.")
    }
  }

  override fun deleteQuestion(user: UserEntity, id: UUID): Either<ServiceIssue, QuestionEntity> {
    log.info("DeleteQuestion[userId={}, username={}, id={}]", user.id(), user.username(), id)
    return when (user.role()) {
      Role.Admin ->
        questionPort
          .sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = findById(id).asMaybe()) {
              is Maybe.Just -> maybeQuestion.value
              Maybe.None -> throw NotExistsException("Question not found.")
            }
          }
          .flatMap { question: QuestionEntity ->
            questionPort.sqlAction {
              deleteById(question.id())
              question
            }
          }
      Role.Teacher -> {
        questionPort
          .sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.findById(id).asMaybe()) {
              is Maybe.Just -> maybeQuestion.value
              Maybe.None -> throw NotExistsException("Question not found.")
            }
          }
          .flatMap { question: QuestionEntity ->
            if (question.creator?.id != user.id()) {
              Forbidden.asEither("User is not allowed to delete this question.")
            } else {
              questionPort.sqlAction {
                deleteById(question.id())
                question
              }
            }
          }
      }
      Role.Student -> Forbidden.asEither("User is not allowed to delete questions.")
    }
  }

  override fun validateQuestion(user: UserEntity, id: UUID): Either<ServiceIssue, ValidationId> {
    log.info("ValidateQuestion[userId={}, username={}, id={}]", user.id(), user.username(), id)
    return getQuestion(user, id).flatMap(questionValidator::validate).map(::ValidationId)
  }

  override fun validationStatus(
    user: UserEntity,
    id: UUID
  ): Either<ServiceIssue, QuestionService.StatusResponse> {
    log.info("ValidationStatus[userId={}, username={}, id={}]", user.id(), user.username(), id)
    return getQuestion(user, id).map { question -> questionValidator.setOrGetStatus(question) }
  }
}
