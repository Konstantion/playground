package com.konstantion.service

import com.konstantion.entity.TestModelEntity
import com.konstantion.entity.UserEntity
import com.konstantion.utils.Either
import java.util.UUID

interface TestModelService {
  fun getTestModelById(
    user: UserEntity,
    id: UUID,
  ): Either<ServiceIssue, TestModelEntity>

  fun getTestModels(user: UserEntity): Either<ServiceIssue, List<TestModelEntity>>

  fun getAllTestModels(user: UserEntity): Either<ServiceIssue, List<TestModelEntity>>

  fun createTestModel(
    user: UserEntity,
    params: CreateTestModelParams,
  ): Either<ServiceIssue, TestModelEntity>

  fun updateTestModel(
    user: UserEntity,
    id: UUID,
    params: UpdateTestModelParams,
  ): Either<ServiceIssue, UpdateResult>

  fun deleteTestModel(
    user: UserEntity,
    id: UUID,
  ): Either<ServiceIssue, TestModelEntity>

  data class CreateTestModelParams(
    val name: String,
  )

  data class UpdateTestModelParams(
    val action: Action,
    val name: String?,
    val questionId: UUID?,
  ) {
    enum class Action {
      ADD,
      REMOVE,
    }
  }

  data class UpdateResult(
    val entity: TestModelEntity,
    val violations: Map<String, List<String>>,
  )
}
