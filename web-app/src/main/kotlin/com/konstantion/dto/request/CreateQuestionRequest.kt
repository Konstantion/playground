package com.konstantion.dto.request

import com.konstantion.model.Lang
import com.konstantion.service.QuestionService

data class CreateQuestionRequest(
  val lang: String,
  val body: String,
) {

  fun asParams(): QuestionService.CreateQuestionParams {
    return QuestionService.CreateQuestionParams(
      lang = Lang.fromString(lang),
      body = body,
    )
  }
}
