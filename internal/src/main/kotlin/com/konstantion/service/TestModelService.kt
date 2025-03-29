package com.konstantion.service

import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.User
import com.konstantion.utils.Either
import java.util.UUID

interface TestModelService<Entity> {
    fun save(user: User, question: Question<Lang>): Either<ServiceIssue, Entity>

    fun getTestModelById(user: User, id: UUID): Either<ServiceIssue, Entity>

    fun getTestModels(user: User): Either<ServiceIssue, List<Entity>>

    fun getAllTestModels(user: User): Either<ServiceIssue, List<Entity>>

    fun createTestModel(user: User, params: CreateTestModelParams): Either<ServiceIssue, Entity>

    fun updateTestModel(user: User, id: UUID, params: UpdateTestModelParams): Either<ServiceIssue, Entity>

    data class CreateTestModelParams(val name: String)

    data class UpdateTestModelParams(val name: String?, val question: UUID)  {
        enum class Action {
            ADD,
            REMOVE
        }
    }
}