package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.CreateQuestionRequest
import com.konstantion.dto.request.UpdateQuestionRequest
import com.konstantion.dto.response.QuestionResponse.Companion.asResponse
import com.konstantion.dto.response.QuestionStatusResponse.Companion.asResponse
import com.konstantion.dto.response.UpdateQuestionResponse
import com.konstantion.entity.QuestionEntity
import com.konstantion.model.User
import com.konstantion.service.QuestionService
import com.konstantion.service.QuestionService.StatusResponse
import com.konstantion.service.QuestionService.UpdateResult
import com.konstantion.service.ServiceIssue
import com.konstantion.utils.Either
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.transaction.support.TransactionTemplate
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
  private val questionService: QuestionService<QuestionEntity>,
  private val transactionTemplate: TransactionTemplate
) {

  @GetMapping
  fun getAllQuestions(): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, List<QuestionEntity>> =
        questionService.getQuestions(User.admin())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @GetMapping("/public")
  fun getPublicQuestions(): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, List<QuestionEntity>> =
        questionService.getPublicQuestions(User.admin())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @GetMapping("/{id}")
  fun getQuestionById(@PathVariable("id") id: UUID): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, QuestionEntity> =
        questionService.getQuestion(User.admin(), id)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> {
        ResponseEntity.ok(result.value.asResponse())
      }
    }
  }

  @PutMapping("/{id}/validate")
  fun validateQuestionById(@PathVariable("id") id: UUID): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, QuestionService.ValidationId> =
        questionService.validateQuestion(User.admin(), id)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.taskId)
    }
  }

  @GetMapping("/{id}/status")
  fun getValidationStatusById(@PathVariable("id") id: UUID): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, StatusResponse> =
        questionService.validationStatus(User.admin(), id)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @PostMapping
  fun createQuestion(@RequestBody request: CreateQuestionRequest): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, QuestionEntity> =
        questionService.createQuestion(User.admin(), request.asParams())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @PatchMapping("/{id}")
  fun updateQuestion(
    @PathVariable("id") id: UUID,
    @RequestBody request: UpdateQuestionRequest
  ): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, UpdateResult<QuestionEntity>> =
        questionService.updateQuestion(User.admin(), id, request.asParams())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> {
        val updateResult = result.value
        ResponseEntity.ok(
          UpdateQuestionResponse(updateResult.violations, updateResult.entity.asResponse())
        )
      }
    }
  }
}
