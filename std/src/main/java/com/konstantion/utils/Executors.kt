package com.konstantion.utils

import java.time.Duration
import java.util.concurrent.ExecutorService
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit

fun ScheduledExecutorService.schedule(
  delay: Duration,
  block: () -> Unit,
): ScheduledFuture<*> = this.schedule(block::invoke, delay.toMillis(), TimeUnit.MILLISECONDS)

fun ExecutorService.closeForcefully() {
  var terminated = isTerminated
  if (!terminated) {
    var interrupted = Thread.currentThread().isInterrupted
    shutdownNow()
    while (!terminated) {
      try {
        terminated = awaitTermination(1, TimeUnit.DAYS)
      } catch (_: InterruptedException) {
        interrupted = true
      }
    }
    if (interrupted) {
      Thread.currentThread().interrupt()
    }
  }
}
