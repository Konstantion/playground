package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.CreateImmutableTestRequest
import com.konstantion.dto.response.ImmutableTestPreviewResponse.Companion.asPreviewResponse
import com.konstantion.dto.response.ImmutableTestResponse.Companion.asResponse
import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.UserEntity
import com.konstantion.service.ImmutableTestService
import com.konstantion.service.ServiceIssue
import com.konstantion.service.UserTestService
import com.konstantion.utils.Either
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/immutable_test")
data class ImmutableTestController(
  private val immutableTestService: ImmutableTestService,
  private val userTestService: UserTestService,
) {
  @GetMapping
  fun findAll(
    @AuthenticationPrincipal userEntity: UserEntity,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, List<ImmutableTestEntity>> =
        immutableTestService.findAllByCreator(userEntity)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right ->
        ResponseEntity.ok(result.value.map { immutableTest -> immutableTest.asPreviewResponse() })
    }

  @GetMapping("/{id}")
  fun findById(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, ImmutableTestEntity> =
        immutableTestService.findById(userEntity, id)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @PostMapping
  fun create(
    @AuthenticationPrincipal userEntity: UserEntity,
    @RequestBody request: CreateImmutableTestRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, ImmutableTestEntity> =
        immutableTestService.createImmutableTest(userEntity, request.asParams())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
}
