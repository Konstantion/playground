package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.response.QuestionResponse.Companion.asResponse
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.UserEntity
import com.konstantion.service.QuestionService
import com.konstantion.service.ServiceIssue
import com.konstantion.utils.Either
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/questions")
class AdminQuestionController(private val questionService: QuestionService<QuestionEntity>) {
  private val log: Logger = LoggerFactory.getLogger(AdminQuestionController::class.java)

  @GetMapping
  fun getAllQuestions(@AuthenticationPrincipal userEntity: UserEntity): ResponseEntity<*> {
    return when (
      val result: Either<ServiceIssue, List<QuestionEntity>> =
        questionService.getAllQuestion(userEntity.asUser())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }
}
