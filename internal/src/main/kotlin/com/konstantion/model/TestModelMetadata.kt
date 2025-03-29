package com.konstantion.model

import java.util.UUID

class TestModelMetadata(
  val id: UUID,
  val name: String,
  val questionMetadatas: List<QuestionMetadata>,
)
