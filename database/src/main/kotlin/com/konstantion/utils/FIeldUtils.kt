package com.konstantion.utils

object FieldUtils {
  fun <T> nonNull(target: T?): T {
    return target ?: error("shouldn't be null")
  }

  fun <I, O> refine(input: I): O where I : Any, O : I {
    return input as O
  }
}
