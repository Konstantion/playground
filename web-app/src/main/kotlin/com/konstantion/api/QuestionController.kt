package com.konstantion.api

import com.fasterxml.jackson.databind.JsonNode
import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.CreateQuestionRequest
import com.konstantion.dto.request.UpdateQuestionRequest
import com.konstantion.dto.response.QuestionResponse.Companion.asResponse
import com.konstantion.dto.response.QuestionStatusResponse.Companion.asResponse
import com.konstantion.dto.response.UpdateQuestionResponse
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.UserEntity
import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.service.QuestionService
import com.konstantion.service.QuestionService.StatusResponse
import com.konstantion.service.QuestionService.UpdateResult
import com.konstantion.service.ServiceIssue
import com.konstantion.utils.Either
import com.konstantion.utils.TransactionsHelper
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.json.Json
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/questions")
data class QuestionController(
  private val questionService: QuestionService,
  private val transactionsHelper: TransactionsHelper,
) {
  @GetMapping
  fun getPublicQuestions(
    @AuthenticationPrincipal userEntity: UserEntity,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, List<QuestionEntity>> =
        transactionsHelper.tx { questionService.getPublicQuestions(userEntity) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @GetMapping("/all")
  fun getAllQuestions(
    @AuthenticationPrincipal userEntity: UserEntity,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, List<QuestionEntity>> =
        transactionsHelper.tx { questionService.getAllQuestion(userEntity) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @PostMapping("/import")
  fun importQuestion(
    @AuthenticationPrincipal userEntity: UserEntity,
    @RequestBody questionJson: JsonNode,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, QuestionEntity> =
        transactionsHelper.tx { questionService.importQuestion(userEntity, questionJson) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @GetMapping("/{id}/export")
  fun exportQuestion(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, QuestionEntity> =
        transactionsHelper.tx { questionService.getQuestion(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> {
        val entity = result.value
        val json =
          Json.encodeToString(
            Question.serializer(Lang.serializer()),
            result.value.toModelWithoutId(),
          )
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON
        headers.setContentDispositionFormData(
          "attachment",
          "question_${entity.id()}_${Instant.now().toEpochMilli()}.json",
        )

        ResponseEntity(json, headers, HttpStatus.OK)
      }
    }

  @GetMapping("/{id}")
  fun getQuestionById(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, QuestionEntity> =
        transactionsHelper.tx { questionService.getQuestion(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> {
        ResponseEntity.ok(result.value.asResponse())
      }
    }

  @PutMapping("/{id}/validate")
  fun validateQuestionById(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, QuestionService.ValidationId> =
        transactionsHelper.tx { questionService.validateQuestion(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.taskId)
    }

  @GetMapping("/{id}/status")
  fun getValidationStatusById(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, StatusResponse> =
        transactionsHelper.tx { questionService.validationStatus(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @PostMapping
  fun createQuestion(
    @AuthenticationPrincipal userEntity: UserEntity,
    @RequestBody request: CreateQuestionRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, QuestionEntity> =
        transactionsHelper.tx { questionService.createQuestion(userEntity, request.asParams()) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @PatchMapping("/{id}")
  fun updateQuestion(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
    @RequestBody request: UpdateQuestionRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, UpdateResult<QuestionEntity>> =
        transactionsHelper.tx { questionService.updateQuestion(userEntity, id, request.asParams()) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> {
        val updateResult = result.value
        ResponseEntity.ok(
          UpdateQuestionResponse(updateResult.violations, updateResult.entity.asResponse()),
        )
      }
    }

  @DeleteMapping("/{id}")
  fun deleteQuestion(
    @AuthenticationPrincipal userEntity: UserEntity,
    @PathVariable("id") id: UUID,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, QuestionEntity> =
        transactionsHelper.tx { questionService.deleteQuestion(userEntity, id) }
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.id())
    }
}
