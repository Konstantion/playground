package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.CreateTestModelRequest
import com.konstantion.dto.request.UpdateTestModelRequest
import com.konstantion.dto.response.TestModelResponse.Companion.asResponse
import com.konstantion.entity.TestModelEntity
import com.konstantion.model.User
import com.konstantion.service.ServiceIssue
import com.konstantion.service.TestModelService
import com.konstantion.utils.Either
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/test_model")
data class TestModelController(private val testModelService: TestModelService<TestModelEntity>) {
  @GetMapping
  fun getAllTestModels(): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, List<TestModelEntity>> =
        testModelService.getTestModels(User.admin())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.map { entity -> entity.asResponse() })
    }
  }

  @GetMapping("/{id}")
  fun getTestModelById(@PathVariable("id") id: UUID): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, TestModelEntity> =
        testModelService.getTestModelById(User.admin(), id)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @PostMapping
  fun createTestModel(@RequestBody request: CreateTestModelRequest): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, TestModelEntity> =
        testModelService.createTestModel(User.admin(), request.asParams())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @PatchMapping("/{id}")
  fun updateTestModel(
    @PathVariable("id") id: UUID,
    @RequestBody request: UpdateTestModelRequest
  ): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, TestModelService.UpdateResult<TestModelEntity>> =
        testModelService.updateTestModel(User.admin(), id, request.asParams())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.entity.asResponse())
    }
  }
}
