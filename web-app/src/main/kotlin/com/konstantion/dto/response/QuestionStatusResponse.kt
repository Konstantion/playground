package com.konstantion.dto.response

import com.konstantion.service.QuestionService

data class QuestionStatusResponse(val status: String) {
  companion object {
    fun QuestionService.StatusResponse.asResponse(): QuestionStatusResponse {
      val status: String =
        when (this) {
          is QuestionService.StatusResponse.Error -> "error: ${this.message}"
          QuestionService.StatusResponse.NotRegistered -> "not registered"
          is QuestionService.StatusResponse.Submitted -> "submitted: ${this.taskId}"
          QuestionService.StatusResponse.Success -> "success"
        }
      return QuestionStatusResponse(status)
    }
  }
}
