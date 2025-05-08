package com.konstantion.dto.request

import com.konstantion.service.ImmutableTestService
import java.util.UUID

data class CreateImmutableTestRequest(
  val testId: UUID,
  val name: String,
  val expiresAfter: Long? = null,
  val shuffleQuestions: Boolean,
  val shuffleVariants: Boolean,
) {
  fun asParams(): ImmutableTestService.CreateImmutableParams =
    ImmutableTestService.CreateImmutableParams(
      testModelId = testId,
      name = name,
      expiresAfter = expiresAfter,
      shuffleQuestions = shuffleQuestions,
      shuffleVariants = shuffleVariants,
    )
}
