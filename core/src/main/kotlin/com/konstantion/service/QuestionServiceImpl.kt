package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.model.Lang
import com.konstantion.model.Permission
import com.konstantion.model.Question
import com.konstantion.model.Role
import com.konstantion.model.User
import com.konstantion.port.QuestionPort
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import java.util.UUID
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
data class QuestionServiceImpl(
  private val questionPort: QuestionPort<QuestionEntity>,
  private val questionValidator: QuestionValidator
) : QuestionService<QuestionEntity> {
  private val log: Logger = LoggerFactory.getLogger(QuestionServiceImpl::class.java)

  override fun save(
    user: User,
    question: Question<Lang>
  ): Either<QuestionService.Issue, QuestionEntity> {
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

  override fun getQuestions(user: User): Either<QuestionService.Issue, List<QuestionEntity>> {
    log.info("GetQuestions[userId={}, username={}]", user.id(), user.getUsername())
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> sqlAction { questionPort.findAllByCreatorId(user.id()) }
      Role.Student -> Forbidden.asEither("User is not allowed to get questions.")
    }
  }

  override fun getPublicQuestions(user: User): Either<QuestionService.Issue, List<QuestionEntity>> {
    log.info("GetPublicQuestions[userId={}, username={}]", user.id(), user.getUsername())
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> sqlAction { questionPort.findAllByPublic(true) }
      Role.Student -> Forbidden.asEither("User is not allowed to get public questions.")
    }
  }

  override fun getQuestion(user: User, id: UUID): Either<QuestionService.Issue, QuestionEntity> {
    log.info("GetQuestion[userId={}, username={}, id={}]", user.id(), user.getUsername(), id)
    return when (user.role()) {
      Role.Admin ->
        sqlAction {
          when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.find(id)) {
            is Maybe.Just -> maybeQuestion.value
            Maybe.None -> throw NotExistsException("Question not found.")
          }
        }
      Role.Teacher -> {
        sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.find(id)) {
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

  override fun deleteQuestion(user: User, id: UUID): Either<QuestionService.Issue, QuestionEntity> {
    log.info("DeleteQuestion[userId={}, username={}, id={}]", user.id(), user.getUsername(), id)
    return when (user.role()) {
      Role.Admin ->
        sqlAction {
            when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.find(id)) {
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
            when (val maybeQuestion: Maybe<QuestionEntity> = questionPort.find(id)) {
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

  override fun validateQuestion(
    user: User,
    id: UUID
  ): Either<QuestionService.Issue, QuestionService.ValidationResponse> {
    TODO("Not yet implemented")
  }

  override fun validationStatus(
    user: User,
    id: UUID
  ): Either<QuestionService.Issue, QuestionService.StatusResponse> {
    TODO("Not yet implemented")
  }

  private fun <T : Any> sqlAction(action: () -> T): Either<QuestionService.Issue, T> {
    return try {
      Either.right(action())
    } catch (dbIssue: Exception) {
      log.error("SqlError[message={}]", dbIssue.message)
      Either.left(SqlError(dbIssue.message ?: "Unknown error"))
    }
  }
}
