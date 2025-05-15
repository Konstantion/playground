package com.konstantion.model

import java.util.UUID

class TestModelMetadata(
  val testModelIdentifier: UUID,
  val name: String,
  val questionMetadatas: List<QuestionMetadata>,
) {
  fun unique(): Boolean {
    val uniqueVariants: MutableSet<String> = mutableSetOf()
    for (metadata in questionMetadatas) {
      for (answer in metadata.answers()) {
        if (!uniqueVariants.add(answer.text)) {
          return false
        }
      }
    }

    return true
  }
}
