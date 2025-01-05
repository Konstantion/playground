package com.konstantion.model

import com.konstantion.lang.Unreachable

interface Code<L, O> where L : Lang, O : Code.Output {
  fun code(): String

  fun lang(): L

  fun outputType(): Class<O>

  sealed interface Output {
    data class Bool(val value: Boolean) : Output

    data class Str(val value: String) : Output

    data object Parser {
      @Suppress("UNCHECKED_CAST")
      fun <O> parse(outputType: Class<O>, rawOutput: List<String>): O where O : Output {
        return when {
          outputType.isAssignableFrom(Bool::class.java) -> Bool(true)
          outputType.isAssignableFrom(Str::class.java) -> Str(rawOutput.joinToString())
          else -> throw Unreachable("All return types should be handled.")
        }
          as O
      }
    }
  }
}
