package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.CreateTestModelRequest
import com.konstantion.dto.request.UpdateTestModelRequest
import com.konstantion.dto.response.TestModelResponse.Companion.asResponse
import com.konstantion.entity.TestModelEntity
import com.konstantion.entity.UserEntity
import com.konstantion.service.ServiceIssue
import com.konstantion.service.TestModelService
import com.konstantion.utils.Either
import com.konstantion.utils.TransactionsHelper
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/test_model")
data class TestModelController(
  private val testModelService: TestModelService,
  private val transactionsHelper: TransactionsHelper,
) {
  @GetMapping
  fun getAllTestModels(
    @AuthenticationPrincipal userEntity: UserEntity,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, List<TestModelEntity>> =
        transactionsHelper.tx { testModelService.getTestModels(userEntity) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.map { entity -> entity.asResponse() })
    }

  @GetMapping("/{id}")
  fun getTestModelById(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, TestModelEntity> =
        transactionsHelper.tx { testModelService.getTestModelById(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @PostMapping
  fun createTestModel(
    @AuthenticationPrincipal userEntity: UserEntity,
    @RequestBody request: CreateTestModelRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, TestModelEntity> =
        transactionsHelper.tx { testModelService.createTestModel(userEntity, request.asParams()) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @PatchMapping("/{id}")
  fun updateTestModel(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
    @RequestBody request: UpdateTestModelRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, TestModelService.UpdateResult> =
        transactionsHelper.tx {
          testModelService.updateTestModel(userEntity, id, request.asParams())
        }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.entity.asResponse())
    }

  @DeleteMapping("/{id}")
  fun deleteTestModel(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, TestModelEntity> =
        transactionsHelper.tx { testModelService.deleteTestModel(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.id())
    }
}
