package com.konstantion.model

import java.util.UUID

data class TestModel(
  val id: UUID,
  val name: String,
  val questions: List<Question<*>>,
)
