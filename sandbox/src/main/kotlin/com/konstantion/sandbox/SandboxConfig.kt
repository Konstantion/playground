package com.konstantion.sandbox

import java.time.Duration

data class SandboxConfig(
  val executionTime: Duration,
) {
  companion object {
    val DEFAULT = SandboxConfig(Duration.ofSeconds(2))
  }
}
