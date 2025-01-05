package com.konstantion.utils

private const val LOG_SHRINK_N = 30

fun String.shrink(n: Int = LOG_SHRINK_N): String {
  val preprocessed = this.lines().joinToString()
  return "${preprocessed.take(n)} ... ${preprocessed.takeLast(n)}"
}
