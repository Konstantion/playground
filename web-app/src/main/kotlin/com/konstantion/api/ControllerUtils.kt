package com.konstantion.api

import com.konstantion.dto.Response
import com.konstantion.service.QuestionService
import org.springframework.http.ResponseEntity

object ControllerUtils {
  fun QuestionService.Issue.asResponse(): ResponseEntity<Response> {
    return ResponseEntity.status(code()).body(Response.Error(code(), message()))
  }
}
