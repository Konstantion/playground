package com.konstantion.utils

enum class MemoryMeasure(
  val multiplier: Int,
) {
  Bytes(1),
  Kilobytes(1024),
  Megabytes(1024 * 1024),
}

object MemoryUtils {
  fun convert(
    value: Long,
    from: MemoryMeasure,
    to: MemoryMeasure,
  ): Long {
    check(value >= 0) { "value should be positive." }
    val bytes = value * from.multiplier
    return bytes / to.multiplier
  }
}
