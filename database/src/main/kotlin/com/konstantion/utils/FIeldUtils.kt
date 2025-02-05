package com.konstantion.utils

object FieldUtils {
  fun <T> nonNull(target: T?): T {
    return target ?: error("shouldn't be null")
  }
}
