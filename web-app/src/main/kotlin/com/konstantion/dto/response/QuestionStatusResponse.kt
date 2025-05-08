package com.konstantion.dto.response

import com.konstantion.service.QuestionService

data class QuestionStatusResponse(
  val status: String,
) {
  companion object {
    fun QuestionService.StatusResponse.asResponse(): QuestionStatusResponse {
      val status: String =
        when (this) {
          is QuestionService.StatusResponse.Error -> "Error: ${this.message}"
          QuestionService.StatusResponse.NotRegistered -> "NotRegistered"
          is QuestionService.StatusResponse.Submitted -> "Submitted: ${this.taskId}"
          QuestionService.StatusResponse.Success -> "Success"
        }
      return QuestionStatusResponse(status)
    }
  }
}
