package com.konstantion.model

import java.util.UUID

class TestModelMetadata(
  val testModelIdentifier: UUID,
  val name: String,
  val questionMetadatas: List<QuestionMetadata>,
)
