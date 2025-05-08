package com.konstantion.dto.response

import com.konstantion.dto.response.QuestionResponse.Companion.asResponse
import com.konstantion.dto.response.UserResponse.Companion.asResponse
import com.konstantion.dto.response.UserTestResponse.Companion.asResponse
import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.ImmutableTestStatus
import java.util.UUID

data class ImmutableTestResponse(
  val id: UUID,
  val name: String,
  val questions: List<QuestionResponse>,
  val status: ImmutableTestStatus,
  val shuffleQuestions: Boolean,
  val shuffleVariants: Boolean,
  val createdAt: Long,
  val creator: UserResponse? = null,
  val expiresAfter: Long?,
  val userTests: List<UserTestResponse>,
) {
  companion object {
    fun ImmutableTestEntity.asResponse(): ImmutableTestResponse {
      val response =
        ImmutableTestResponse(
          id = id(),
          name = name(),
          questions = questions().map { question -> question.asResponse() },
          status = status(),
          shuffleQuestions = shuffleQuestions(),
          shuffleVariants = shuffleVariants(),
          createdAt = createdAt().toEpochMilli(),
          creator = creator()?.asResponse(),
          expiresAfter = expiresAfter()?.toEpochMilli(),
          userTests = userTests().map { userTest -> userTest.asResponse() },
        )
      return response
    }
  }
}

data class ImmutableTestPreviewResponse(
  val id: UUID,
  val name: String,
  val status: ImmutableTestStatus,
  val createdAt: Long,
  val creatorId: UUID? = null,
  val expiresAfter: Long?,
) {
  companion object {
    fun ImmutableTestEntity.asPreviewResponse(): ImmutableTestPreviewResponse =
      ImmutableTestPreviewResponse(
        id = id(),
        name = name(),
        status = status(),
        createdAt = createdAt().toEpochMilli(),
        creatorId = creator()?.id(),
        expiresAfter = expiresAfter()?.toEpochMilli(),
      )
  }
}
