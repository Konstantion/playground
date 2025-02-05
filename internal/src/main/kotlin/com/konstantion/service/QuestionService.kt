package com.konstantion.service

import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.TaskId
import com.konstantion.model.User
import com.konstantion.utils.Either
import java.util.UUID

interface QuestionService<Entry> {
  fun save(user: User, question: Question<Lang>): Either<Issue, Entry>

  fun getQuestions(user: User): Either<Issue, List<Entry>>

  fun getQuestion(user: User, id: UUID): Either<Issue, Entry>

  fun deleteQuestion(user: User, id: UUID): Either<Issue, Entry>

  fun registerQuestion(user: User, question: Question<Lang>): Either<Issue, RegisterResponse>

  fun registrationStatus(user: User, taskId: TaskId): Either<Issue, StatusResponse>

  sealed interface Issue {}

  data class RegisterResponse(val taskId: TaskId)

  sealed interface StatusResponse {
    data object NotRegistered : StatusResponse
    data object Pending : StatusResponse
    data class Submitted(val taskId: TaskId) : StatusResponse
    data object Completed : StatusResponse
  }
}
