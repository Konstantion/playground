package com.konstantion.dto.response

import com.konstantion.dto.response.QuestionResponse.Companion.asResponse
import com.konstantion.dto.response.UserResponse.Companion.asResponse
import com.konstantion.dto.response.UserTestResponse.Companion.asResponse
import com.konstantion.entity.ImmutableTestEntity
import java.util.UUID

data class ImmutableTestResponse(
  val id: UUID,
  val name: String,
  val questions: List<QuestionResponse>,
  val active: Boolean,
  val shuffleQuestions: Boolean,
  val shuffleVariants: Boolean,
  val createdAt: Long,
  val creator: UserResponse? = null,
  val expiresAfter: Long?,
  val userTests: List<UserTestResponse>
) {
  companion object {
    fun ImmutableTestEntity.asResponse(): ImmutableTestResponse {
      return ImmutableTestResponse(
        id = id(),
        name = name(),
        questions = questions().map { question -> question.asResponse() },
        active = active(),
        shuffleQuestions = shuffleQuestions(),
        shuffleVariants = shuffleVariants(),
        createdAt = createdAt().toEpochMilli(),
        creator = creator()?.asResponse(),
        expiresAfter = expiresAfter()?.toEpochMilli(),
        userTests = userTests().map { userTest -> userTest.asResponse() }
      )
    }
  }
}

data class ImmutableTestPreviewResponse(
  val id: UUID,
  val name: String,
  val active: Boolean,
  val createdAt: Long,
  val creatorId: UUID? = null,
  val expiresAfter: Long?,
) {
  companion object {
    fun ImmutableTestEntity.asPreviewResponse(): ImmutableTestPreviewResponse {
      return ImmutableTestPreviewResponse(
        id = id(),
        name = name(),
        active = active(),
        createdAt = createdAt().toEpochMilli(),
        creatorId = creator()?.id(),
        expiresAfter = expiresAfter()?.toEpochMilli()
      )
    }
  }
}
