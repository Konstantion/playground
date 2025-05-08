package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.CreateVariantRequest
import com.konstantion.dto.request.UpdateVariantRequest
import com.konstantion.dto.response.VariantResponse.Companion.asResponse
import com.konstantion.entity.UserEntity
import com.konstantion.entity.VariantEntity
import com.konstantion.service.ServiceIssue
import com.konstantion.service.VariantService
import com.konstantion.utils.Either
import com.konstantion.utils.TransactionsHelper
import java.util.UUID
import org.slf4j.Logger
import org.slf4j.LoggerFactory
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
@RequestMapping("/api/variant")
data class VariantController(
  private val variantService: VariantService,
  private val transactionsHelper: TransactionsHelper,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  @GetMapping("/{id}")
  fun getById(
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> {
    log.info("Fetching variant with ID: {}", id)
    return when (
      val result: Either<ServiceIssue, VariantEntity> =
        transactionsHelper.tx { variantService.getById(id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @PostMapping
  fun createVariant(
    @AuthenticationPrincipal userEntity: UserEntity,
    @RequestBody request: CreateVariantRequest,
  ): ResponseEntity<*> {
    log.info("Creating variant with request: {}", request)
    return when (
      val result: Either<ServiceIssue, VariantEntity> =
        transactionsHelper.tx { variantService.create(userEntity, request.asParams()) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @PatchMapping("/{id}")
  fun updateVariantById(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
    @RequestBody request: UpdateVariantRequest,
  ): ResponseEntity<*> {
    log.info("Updating variant with ID: {} and request: {}", id, request)
    return when (
      val result: Either<ServiceIssue, VariantEntity> =
        transactionsHelper.tx { variantService.update(userEntity, request.asParams(id)) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @DeleteMapping("/{id}")
  fun deleteVariantById(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> {
    log.info("Deleting variant with ID: {}", id)
    return when (
      val result: Either<ServiceIssue, VariantEntity> =
        transactionsHelper.tx { variantService.delete(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }
}
