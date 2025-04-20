package com.konstantion.dto.request

import com.konstantion.service.TestModelService
import java.util.UUID

data class UpdateTestModelRequest(
  val action: TestModelService.UpdateTestModelParams.Action,
  val name: String?,
  val questionId: UUID?
) {
  fun asParams(): TestModelService.UpdateTestModelParams =
    TestModelService.UpdateTestModelParams(action = action, name = name, questionId = questionId)
}
