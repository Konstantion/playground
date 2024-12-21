package com.konstantion

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication class ApplicationStarter

fun main() {
  runApplication<ApplicationStarter>()
}
