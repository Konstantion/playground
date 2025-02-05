package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.Role
import com.konstantion.model.TaskId
import com.konstantion.model.User
import com.konstantion.port.QuestionPort
import com.konstantion.utils.Either
import java.util.UUID
import org.springframework.stereotype.Service

@Service
data class QuestionServiceImpl(private val questionPort: QuestionPort<QuestionEntity>) :
  QuestionService<QuestionEntity> {
  override fun save(
    user: User,
    question: Question<Lang>
  ): Either<QuestionService.Issue, QuestionEntity> {
    return if (user.role() == Role.Admin) {
      Either.right(questionPort.save(QuestionEntity.fromModel(question)))
    } else {
      return Either.left(Forbidden("User is not allowed to save questions"))
    }
  }

  override fun getQuestions(user: User): Either<QuestionService.Issue, List<QuestionEntity>> {
    if (user.role() != Role.Admin) {
      return Either.left(Forbidden("User is not allowed to get questions"))
    }

    return Either.right(questionPort.findAll())
  }

  override fun getQuestion(user: User, id: UUID): Either<QuestionService.Issue, QuestionEntity> {
    TODO("Not yet implemented")
  }

  override fun deleteQuestion(user: User, id: UUID): Either<QuestionService.Issue, QuestionEntity> {
    TODO("Not yet implemented")
  }

  override fun registerQuestion(
    user: User,
    question: Question<Lang>
  ): Either<QuestionService.Issue, QuestionService.RegisterResponse> {
    TODO("Not yet implemented")
  }

  override fun registrationStatus(
    user: User,
    taskId: TaskId
  ): Either<QuestionService.Issue, QuestionService.StatusResponse> {
    TODO("Not yet implemented")
  }
}
