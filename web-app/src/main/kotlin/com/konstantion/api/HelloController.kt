package com.konstantion.api

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/hello")
class HelloController {
  @GetMapping
  fun hello(): ResponseEntity<String> {
    return ResponseEntity.ok("hello from the server!")
  }
}
