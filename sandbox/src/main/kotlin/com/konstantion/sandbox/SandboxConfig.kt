package com.konstantion.sandbox

import java.time.Duration

data class SandboxConfig(
  val cpuTime: Duration,
  val memoryLimitKb: Long,
) {
  companion object {
    val DEFAULT = SandboxConfig(Duration.ofSeconds(2), 500 * 1024 * 10)
  }
}
