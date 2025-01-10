package com.konstantion.utils

import java.time.Duration
import java.util.concurrent.ScheduledThreadPoolExecutor
import java.util.concurrent.ThreadFactory
import java.util.concurrent.TimeUnit

private const val CORE_POOL_SIZE: Int = 1
private const val TERMINATION_TIMEOUT_SECONDS: Long = 10L
private val MAX_POOL_SIZE: Int = Runtime.getRuntime().availableProcessors()
private val THREAD_FACTORY: ThreadFactory =
  Thread.ofPlatform().daemon().name("common-scheduler-worker").factory()

object CommonScheduler {
  private val UNDERLYING: ScheduledThreadPoolExecutor =
    ScheduledThreadPoolExecutor(CORE_POOL_SIZE, THREAD_FACTORY).apply {
      maximumPoolSize = MAX_POOL_SIZE
      allowCoreThreadTimeOut(true)

      Runtime.getRuntime()
        .addShutdownHook(
          Thread {
            shutdownNow()
            try {
              if (!awaitTermination(TERMINATION_TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
                System.err.println("Scheduler didn't terminate in time.")
              }
            } catch (_: InterruptedException) {
              Thread.currentThread().interrupt()
            }
          },
        )
    }

  fun loopWithDelay(
    delay: Duration,
    block: () -> Unit,
  ) {
    UNDERLYING.scheduleWithFixedDelay(
      block::invoke,
      delay.toMillis(),
      delay.toMillis(),
      TimeUnit.MILLISECONDS,
    )
  }
}
