package com.konstantion.api

import com.konstantion.dto.ErrorResponse
import com.konstantion.service.QuestionService
import org.springframework.http.ResponseEntity

object ControllerUtils {
  fun QuestionService.Issue.asError(): ResponseEntity<ErrorResponse> {
    return ResponseEntity.status(code()).body(ErrorResponse(code(), message()))
  }
}
