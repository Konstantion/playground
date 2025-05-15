package com.konstantion.dto.response

import com.konstantion.dto.response.QuestionAnswerResponse.Companion.asResponse
import com.konstantion.dto.response.TestMetadataResponse.Companion.asResponse
import com.konstantion.dto.response.UserResponse.Companion.asResponse
import com.konstantion.entity.UserTestEntity
import com.konstantion.entity.UserTestStatus
import java.util.UUID

data class UserTestResponse(
  val id: UUID,
  val testId: UUID,
  val testMetadata: TestMetadataResponse?,
  val user: UserResponse,
  val questionAnswers: List<QuestionAnswerResponse>?,
  val status: UserTestStatus,
  val startedAt: Long?,
  val completedAt: Long?,
  val score: Double?,
  val shuffleVariants: Boolean,
) {
  companion object {
    fun UserTestEntity.asResponse(): UserTestResponse =
      UserTestResponse(
        id = id(),
        testId = immutableTest().id(),
        testMetadata = testMetadata().asResponse(),
        user = user().asResponse(),
        questionAnswers = questionAnswers().map { answer -> answer.asResponse() },
        status = status(),
        startedAt = startedAt()?.toEpochMilli(),
        completedAt = completedAt()?.toEpochMilli(),
        score = score(),
        shuffleVariants = immutableTest().shuffleVariants(),
      )
  }
}
