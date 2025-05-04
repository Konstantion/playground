package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.UserEntity
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.Question
import com.konstantion.model.TaskId
import com.konstantion.utils.Either
import java.util.UUID

interface QuestionService {
  fun save(user: UserEntity, question: Question<Lang>): Either<ServiceIssue, QuestionEntity>

  fun getQuestions(user: UserEntity): Either<ServiceIssue, List<QuestionEntity>>

  fun getAllQuestion(user: UserEntity): Either<ServiceIssue, List<QuestionEntity>>

  fun getPublicQuestions(user: UserEntity): Either<ServiceIssue, List<QuestionEntity>>

  fun getQuestion(user: UserEntity, id: UUID): Either<ServiceIssue, QuestionEntity>

  fun createQuestion(
    user: UserEntity,
    params: CreateQuestionParams
  ): Either<ServiceIssue, QuestionEntity>

  fun updateQuestion(
    user: UserEntity,
    id: UUID,
    params: UpdateQuestionParams
  ): Either<ServiceIssue, UpdateResult<QuestionEntity>>

  fun deleteQuestion(user: UserEntity, id: UUID): Either<ServiceIssue, QuestionEntity>

  fun validateQuestion(user: UserEntity, id: UUID): Either<ServiceIssue, ValidationId>

  fun validationStatus(user: UserEntity, id: UUID): Either<ServiceIssue, StatusResponse>

  data class ValidationId(val taskId: TaskId)

  data class CreateQuestionParams(val lang: Lang, val body: String)

  data class UpdateQuestionParams(
    val action: Action,
    val body: String? = null,
    val formatAndCode: FormatAndCode? = null,
    val placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>? = null,
    val placeholders: List<PlaceholderIdentifier>? = null,
    val callArgs: List<PlaceholderLabel>? = null,
    val args: List<PlaceholderIdentifier>? = null,
    val additionalCheckId: UUID? = null,
    val correctVariantId: UUID? = null,
    val incorrectVariantId: UUID? = null,
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
