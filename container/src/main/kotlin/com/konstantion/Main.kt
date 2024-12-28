package com.konstantion

import com.github.dockerjava.api.async.ResultCallback
import com.github.dockerjava.api.model.Frame
import com.github.dockerjava.core.DockerClientBuilder
import com.konstantion.ImagePuller.pull
import java.time.Duration

const val code =
  """
a = 10
b = 20
w = "haha"
def userfunction(a, b, w):
	c = b * a
	a *= 3
	result = c - a
	return str(result) + w
	

if __name__ == "__main__":
		print(userfunction(a, b, w))
"""

fun main() {
  DockerClientBuilder.getInstance().build().use { client ->
    client.pull(Image.PYTHON_3_9, Duration.ofMinutes(2))

    try {
      val container =
        client.createContainerCmd(Image.PYTHON_3_9.name).withCmd("python", "-c", code).exec()

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
          }
        )
        .awaitCompletion()
    } catch (error: Throwable) {
      println("error=$error")
    }
  }
}
