package com.konstantion.service

import com.konstantion.model.User
import com.konstantion.utils.Either
import java.util.UUID

interface TestModelService<Entity> {
  fun getTestModelById(user: User, id: UUID): Either<ServiceIssue, Entity>

  fun getTestModels(user: User): Either<ServiceIssue, List<Entity>>

  fun getAllTestModels(user: User): Either<ServiceIssue, List<Entity>>

  fun createTestModel(user: User, params: CreateTestModelParams): Either<ServiceIssue, Entity>

  fun updateTestModel(
    user: User,
    id: UUID,
    params: UpdateTestModelParams
  ): Either<ServiceIssue, UpdateResult<Entity>>

  data class CreateTestModelParams(val name: String)

  data class UpdateTestModelParams(val action: Action, val name: String?, val questionId: UUID?) {
    enum class Action {
      ADD,
      REMOVE
    }
  }

  data class UpdateResult<Entity>(val entity: Entity, val violations: Map<String, List<String>>)
}
