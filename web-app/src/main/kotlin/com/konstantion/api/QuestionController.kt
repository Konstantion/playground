package com.konstantion.api

import com.konstantion.api.ControllerUtils.asError
import com.konstantion.dto.QuestionResponse.Companion.asResponse
import com.konstantion.entity.QuestionEntity
import com.konstantion.model.User
import com.konstantion.repository.QuestionRepository
import com.konstantion.service.QuestionService
import com.konstantion.utils.Either
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/questions")
data class QuestionController(
  private val questionRepository: QuestionRepository,
  private val questionService: QuestionService<QuestionEntity>
) {

  @GetMapping
  fun getAllQuestions(): ResponseEntity<*> {
    return when (
      val result: Either<QuestionService.Issue, List<QuestionEntity>> =
        questionService.getQuestions(User.admin())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @GetMapping("/public")
  fun getPublicQuestions(): ResponseEntity<*> {
    return when (
      val result: Either<QuestionService.Issue, List<QuestionEntity>> =
        questionService.getPublicQuestions(User.admin())
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> ResponseEntity.ok(result.value.asResponse())
    }
  }

  @GetMapping("/{id}")
  fun getQuestionById(@PathVariable("id") id: UUID): ResponseEntity<*> {
    return when (
      val result: Either<QuestionService.Issue, QuestionEntity> =
        questionService.getQuestion(User.admin(), id)
    ) {
      is Either.Left -> result.value.asError()
      is Either.Right -> {
        ResponseEntity.ok(result.value.asResponse())
      }
    }
  }
}
