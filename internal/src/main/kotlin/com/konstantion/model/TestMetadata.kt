package com.konstantion.model

import java.util.UUID

class TestMetadata(
  val id: UUID,
  val name: String,
  val questionsMetadata: List<QuestionMetadata>,
)
