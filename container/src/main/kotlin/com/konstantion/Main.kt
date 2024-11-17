package com.konstantion

import com.github.dockerjava.api.async.ResultCallback
import com.github.dockerjava.api.model.Frame
import com.github.dockerjava.core.DockerClientBuilder
import com.konstantion.ImagePuller.pull
import java.time.Duration

fun main() {
  DockerClientBuilder.getInstance().build().use { client ->
    client.pull(Image.PYTHON_3_9, Duration.ofMinutes(2))

    try {
      val container =
          client
              .createContainerCmd(Image.PYTHON_3_9.name)
              .withCmd("python", "-c", "print('Hello from Docker')")
              .exec()

      val id: String = container.id
      println("Container id=$id")

      client.startContainerCmd(id).exec()
      client
          .logContainerCmd(id)
          .withStdOut(true)
          .withStdErr(true)
          .withFollowStream(true)
          .exec(
              object : ResultCallback.Adapter<Frame>() {
                override fun onNext(frame: Frame) {
                  println(String(frame.payload))
                }
              })
          .awaitCompletion()
    } catch (error: Throwable) {
      println("error=$error")
    }
  }
}
