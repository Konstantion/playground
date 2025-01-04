package com.konstantion.utils

import java.time.Duration
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit

fun ScheduledExecutorService.schedule(delay: Duration, block: () -> Unit): ScheduledFuture<*> {
  return this.schedule(block::invoke, delay.toMillis(), TimeUnit.MILLISECONDS)
}
