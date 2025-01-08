package com.konstantion.sandbox

import com.konstantion.utils.MemoryMeasure
import com.konstantion.utils.MemoryUtils
import java.time.Duration

data class SandboxConfig(
  val cpuTime: Duration,
  val memoryLimitKb: Long,
) {
  companion object {
    val DEFAULT =
      SandboxConfig(
        Duration.ofSeconds(2),
        MemoryUtils.convert(50, MemoryMeasure.Megabytes, MemoryMeasure.Kilobytes)
      )
  }
}
