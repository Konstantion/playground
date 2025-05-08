package com.konstantion.utils

object FieldUtils {
  fun <T> nonNull(target: T?): T = target ?: error("shouldn't be null")
}
