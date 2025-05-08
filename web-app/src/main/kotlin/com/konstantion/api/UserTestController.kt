package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.AddUserTestRequest
import com.konstantion.dto.response.ErrorResponse
import com.konstantion.dto.response.UserTestResponse.Companion.asResponse
import com.konstantion.entity.UserEntity
import com.konstantion.entity.UserTestEntity
import com.konstantion.entity.UserTestStatus
import com.konstantion.service.ServiceIssue
import com.konstantion.service.UserTestService
import com.konstantion.utils.Either
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/user_test")
class UserTestController(
  private val userTestService: UserTestService,
) {
  @GetMapping
  fun getMyTests(
    @AuthenticationPrincipal user: UserEntity,
  ): ResponseEntity<*> =
    when (val result = userTestService.getTestsForUser(user)) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.map { test -> test.asResponse() })
    }

  @PostMapping
  fun addTestForUser(
    @AuthenticationPrincipal user: UserEntity,
    @RequestBody request: AddUserTestRequest,
  ): ResponseEntity<*> =
    when (
      val result: Either<ServiceIssue, UserTestEntity> =
        userTestService.createTestForUser(user, request.immutableTestId)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @PutMapping("/{userTestId}/start")
  fun startTest(
    @AuthenticationPrincipal user: UserEntity,
    @PathVariable userTestId: UUID,
  ): ResponseEntity<*> =
    when (val result = userTestService.startTest(user, userTestId)) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }

  @GetMapping("/{userTestId}/take")
  fun getTestDataForTaking(
    @AuthenticationPrincipal user: UserEntity,
    @PathVariable userTestId: UUID,
  ): ResponseEntity<*> {
    return when (val result = userTestService.getTestForUser(user, userTestId)) {
      is Either.Left -> result.value.asError()
      is Either.Right -> {
        val userTest = result.value
        if (
          userTest.status() != UserTestStatus.IN_PROGRESS &&
            userTest.status() != UserTestStatus.NOT_STARTED
        ) {
          if (userTest.status() != UserTestStatus.IN_PROGRESS) {
            return ResponseEntity.status(403)
              .body(ErrorResponse(403, "Test is not in progress. Start the test first."))
          }
        }

        ResponseEntity.ok(userTest.asResponse())
      }
    }
  }

  @PostMapping("/submit")
  fun submitAnswers(
    @AuthenticationPrincipal user: UserEntity,
    @RequestBody request: UserTestService.UserAnswerParams,
  ): ResponseEntity<*> =
    when (val result = userTestService.submitUserAnswer(user, request)) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
}
