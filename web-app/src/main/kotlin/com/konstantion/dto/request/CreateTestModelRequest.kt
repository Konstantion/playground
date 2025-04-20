package com.konstantion.dto.request

import com.konstantion.service.TestModelService

data class CreateTestModelRequest(val name: String) {
  fun asParams(): TestModelService.CreateTestModelParams =
    TestModelService.CreateTestModelParams(name = name)
}
