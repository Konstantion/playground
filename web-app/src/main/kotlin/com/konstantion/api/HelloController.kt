package com.konstantion.api

import com.konstantion.entity.UserEntity
import com.konstantion.service.QuestionService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/hello")
class HelloController(private val questionService: QuestionService) {
  @GetMapping
  fun hello(@AuthenticationPrincipal userEntity: UserEntity): ResponseEntity<String> {
    return ResponseEntity.ok("hello ${userEntity.username()}!")
  }
}
