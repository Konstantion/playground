package com.konstantion.dto.request

import com.konstantion.service.ImmutableTestService
import java.util.UUID

data class CreateImmutableTestRequest(
  val testId: UUID,
  val expiresAfter: Long? = null,
  val shuffleQuestions: Boolean,
  val shuffleVariants: Boolean,
) {
  fun asParams(): ImmutableTestService.CreateImmutableParams {
    return ImmutableTestService.CreateImmutableParams(
      testModelId = testId,
      expiresAfter = expiresAfter,
      shuffleQuestions = shuffleQuestions,
      shuffleVariants = shuffleVariants
    )
  }
}
