package com.konstantion

import com.github.dockerjava.api.DockerClient
import com.github.dockerjava.core.DockerClientBuilder
import com.konstantion.utils.Either
import java.time.Duration
import java.util.concurrent.TimeUnit

object ImagePuller {
  @JvmStatic
  @Throws(InterruptedException::class)
  fun DockerClient.pull(
    image: Image,
    timeout: Duration = Duration.ofMillis(Long.MAX_VALUE),
  ): Either<Throwable, Boolean> =
    try {
      Either.right(
        pullImageCmd(image.name).start().awaitCompletion(timeout.toMillis(), TimeUnit.MILLISECONDS)
      )
    } catch (error: Throwable) {
      Either.left(error)
    }

  @JvmStatic
  @Throws(InterruptedException::class)
  fun pull(
    image: Image,
    timeout: Duration = Duration.ofMillis(Long.MAX_VALUE),
  ): Either<Throwable, Boolean> = DockerClientBuilder.getInstance().build().pull(image, timeout)
}
