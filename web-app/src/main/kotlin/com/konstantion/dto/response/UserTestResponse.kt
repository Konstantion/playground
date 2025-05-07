package com.konstantion.dto.response

import com.konstantion.dto.response.QuestionAnswerResponse.Companion.asResponse
import com.konstantion.dto.response.TestMetadataResponse.Companion.asResponse
import com.konstantion.dto.response.UserResponse.Companion.asResponse
import com.konstantion.entity.UserTestEntity
import java.util.UUID

data class UserTestResponse(
  val id: UUID,
  val testId: UUID,
  val testMetadata: TestMetadataResponse,
  val user: UserResponse,
  val questionAnswers: List<QuestionAnswerResponse>,
  val active: Boolean,
) {
  companion object {
    fun UserTestEntity.asResponse(): UserTestResponse {
      return UserTestResponse(
        id = id(),
        testId = immutableTest().id(),
        testMetadata = testMetadata().asResponse(),
        user = user().asResponse(),
        questionAnswers = questionAnswers().map { questionAnswer -> questionAnswer.asResponse() },
        active = active()
      )
    }
  }
}
