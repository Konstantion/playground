package com.konstantion

@ConsistentCopyVisibility
data class Image
internal constructor(
  val name: String,
) {
  companion object {
    @JvmField val PYTHON_3_9 = of("python:3.9")

    @JvmStatic
    fun latest(name: String): Image {
      check(name.isNotBlank()) { "Name shouldn't be blank." }

      return Image("$name:latest")
    }

    @JvmStatic
    fun of(name: String): Image {
      check(name.isNotBlank()) { "Name shouldn't be blank" }
      check(name.contains(':')) { "Name should contain ':' separator." }

      return Image(name)
    }
  }
}
