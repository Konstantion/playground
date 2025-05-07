package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.request.AddUserTestRequest
import com.konstantion.dto.response.UserTestResponse.Companion.asResponse
import com.konstantion.entity.UserEntity
import com.konstantion.entity.UserTestEntity
import com.konstantion.service.ServiceIssue
import com.konstantion.service.UserTestService
import com.konstantion.utils.Either
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/user_test")
class UserTestController(
  private val userTestService: UserTestService,
) {
  @GetMapping
  fun getMyTests(@AuthenticationPrincipal user: UserEntity): ResponseEntity<*> {
    return when (val result = userTestService.getTestsForUser(user)) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.map { userTest -> userTest.asResponse() })
    }
  }

  @PostMapping
  fun addTestForUser(
    @AuthenticationPrincipal user: UserEntity,
    @RequestBody request: AddUserTestRequest
  ): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, UserTestEntity> =
        userTestService.createTestForUser(
          user,
          request.immutableTestId,
        )
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }
}
