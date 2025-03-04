package com.konstantion.dto

sealed interface Response {
  data class Error(val code: Int, val message: String) : Response
  data class OfString(val value: String) : Response
}
