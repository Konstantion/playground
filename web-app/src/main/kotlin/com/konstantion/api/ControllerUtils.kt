package com.konstantion.api

import com.konstantion.dto.response.ErrorResponse
import com.konstantion.service.ServiceIssue
import org.springframework.http.ResponseEntity

object ControllerUtils {
  fun ServiceIssue.asError(): ResponseEntity<ErrorResponse> =
    ResponseEntity.status(code()).body(ErrorResponse(code(), message()))
}
