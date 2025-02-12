package com.konstantion.service

import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.TaskId
import com.konstantion.model.User
import com.konstantion.utils.Either
import java.util.UUID

interface QuestionService<Entity> {
  fun save(user: User, question: Question<Lang>): Either<Issue, Entity>

  fun getQuestions(user: User): Either<Issue, List<Entity>>

  fun getPublicQuestions(user: User): Either<Issue, List<Entity>>

  fun getQuestion(user: User, id: UUID): Either<Issue, Entity>

  fun deleteQuestion(user: User, id: UUID): Either<Issue, Entity>

  fun validateQuestion(user: User, id: UUID): Either<Issue, ValidationResponse>

  fun validationStatus(user: User, id: UUID): Either<Issue, StatusResponse>

  sealed interface Issue {
    data class UnexpectedAction(val action: String) : Issue
  }

  data class ValidationResponse(val taskId: TaskId)

  sealed interface StatusResponse {
    data object NotRegistered : StatusResponse
    data class Submitted(val taskId: TaskId) : StatusResponse
    data object Success : StatusResponse
    data class Error(val message: String) : StatusResponse
  }
}
