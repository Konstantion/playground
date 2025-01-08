package com.konstantion.interpreter

import com.konstantion.utils.Maybe

interface VariableNameSupport {
  fun nextName(): Maybe<String>

  companion object {
    fun create(): VariableNameSupport {
      return object : VariableNameSupport {
        val names: Iterator<String> = validNames().listIterator()

        override fun nextName(): Maybe<String> {
          return if (names.hasNext()) {
            Maybe.just(names.next())
          } else {
            Maybe.none()
          }
        }
      }
    }

    private fun validNames(): List<String> =
      listOf("a", "b", "x", "y", "c", "d", "e", "f", "g", "h", "i")
  }
}
