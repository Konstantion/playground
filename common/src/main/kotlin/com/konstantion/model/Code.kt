package com.konstantion.model

import com.konstantion.lang.Unreachable
import kotlin.jvm.Throws

interface Code<L, O> where L : Lang, O : Code.Output {
  fun code(): String

  fun lang(): L

  fun outputType(): Class<O>

  sealed interface Output {

    data class Bool(val value: Boolean) : Output {
      companion object {
        @Throws(ParserException::class)
        fun parse(toParse: String): Output {
          return when (toParse.lowercase()) {
            in "true",
            "1" -> Bool(true)
            in "false",
            "0" -> Bool(false)
            else -> throw ParserException("Failed to parse Bool from $toParse.")
          }
        }
      }
    }

    data class Str(val value: String) : Output

    data object Parser {
      @Suppress("UNCHECKED_CAST")
      @Throws(ParserException::class)
      fun <O> parse(outputType: Class<O>, rawOutput: List<String>): O where O : Output {
        return when {
          outputType.isAssignableFrom(Bool::class.java) -> {
            val toParse = rawOutput.joinToString()
            Bool.parse(toParse)
          }
          outputType.isAssignableFrom(Str::class.java) -> Str(rawOutput.joinToString())
          else -> throw Unreachable("All return types should be handled.")
        }
          as O
      }
    }

    class ParserException(override val message: String) : Exception(message)
  }
}
