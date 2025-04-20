package com.konstantion.helper

import com.konstantion.dto.response.ErrorResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
  private val log: Logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

  @ExceptionHandler(Exception::class)
  fun handleAllException(ex: Exception): ResponseEntity<ErrorResponse> {
    log.error("Unhandled exception: {}", ex.message, ex)

    val message: String = ex.message ?: "Unknown error"
    return ResponseEntity.status(500).body(ErrorResponse(500, message))
  }
}
