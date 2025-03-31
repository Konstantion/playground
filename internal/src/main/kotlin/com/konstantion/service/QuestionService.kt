package com.konstantion.service

import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.Question
import com.konstantion.model.TaskId
import com.konstantion.model.User
import com.konstantion.utils.Either
import java.util.UUID

interface QuestionService<Entity> {
  fun save(user: User, question: Question<Lang>): Either<ServiceIssue, Entity>

  fun getQuestions(user: User): Either<ServiceIssue, List<Entity>>

  fun getAllQuestion(user: User): Either<ServiceIssue, List<Entity>>

  fun getPublicQuestions(user: User): Either<ServiceIssue, List<Entity>>

  fun getQuestion(user: User, id: UUID): Either<ServiceIssue, Entity>

  fun createQuestion(user: User, params: CreateQuestionParams): Either<ServiceIssue, Entity>

  fun updateQuestion(
    user: User,
    id: UUID,
    params: UpdateQuestionParams
  ): Either<ServiceIssue, UpdateResult<Entity>>

  fun deleteQuestion(user: User, id: UUID): Either<ServiceIssue, Entity>

  fun validateQuestion(user: User, id: UUID): Either<ServiceIssue, ValidationId>

  fun validationStatus(user: User, id: UUID): Either<ServiceIssue, StatusResponse>

  data class ValidationId(val taskId: TaskId)

  data class CreateQuestionParams(val lang: Lang, val body: String)

  data class UpdateQuestionParams(
    val action: Action,
    val body: String? = null,
    val formatAndCode: FormatAndCode? = null,
    val placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>? = null,
    val callArgs: List<PlaceholderLabel>? = null,
    val additionalCheckId: UUID? = null,
    val correctVariantId: UUID? = null,
    val incorrectVariantId: UUID? = null,
    val public: Boolean? = null
  ) {

    enum class Action {
      ADD,
      REMOVE
    }
  }

  data class UpdateResult<Entity>(val entity: Entity, val violations: Map<String, List<String>>)

  sealed interface StatusResponse {
    data object NotRegistered : StatusResponse
    data class Submitted(val taskId: TaskId) : StatusResponse
    data object Success : StatusResponse
    data class Error(val message: String) : StatusResponse
  }
}
