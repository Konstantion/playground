package com.konstantion.model

import com.konstantion.lang.Unreachable
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonClassDiscriminator

@OptIn(ExperimentalSerializationApi::class)
@Serializable
@JsonClassDiscriminator("type")
sealed interface PlaceholderDefinition<T> where T : PlaceholderValue {
  fun value(): T

  sealed interface RandomOneOf<T> : PlaceholderDefinition<T> where T : PlaceholderValue {
    val options: List<T>

    override fun value(): T = options.random()

    @Serializable
    @SerialName("i32_random_one_of")
    private data class I32(override val options: List<PlaceholderValue.I32>) :
      RandomOneOf<PlaceholderValue.I32> {
      init {
        check(options.isNotEmpty()) { "Options couldn't be empty." }
      }
    }

    @Serializable
    @SerialName("str_random_one_of")
    private data class Str(override val options: List<PlaceholderValue.Str>) :
      RandomOneOf<PlaceholderValue.Str> {
      init {
        check(options.isNotEmpty()) { "Options couldn't be empty." }
      }
    }

    companion object {
      @Suppress("UNCHECKED_CAST")
      fun <T> of(options: List<T>): RandomOneOf<T> where T : PlaceholderValue {
        return when (options.first() as PlaceholderValue) {
          is PlaceholderValue.I32 -> I32(options as List<PlaceholderValue.I32>)
          is PlaceholderValue.Str -> Str(options as List<PlaceholderValue.Str>)
        }
          as RandomOneOf<T>
      }
    }
  }

  @Serializable
  @SerialName("i32_range")
  data class I32Range(private val start: Int, private val end: Int) :
    PlaceholderDefinition<PlaceholderValue.I32> {
    init {
      check(start <= end) { "Start should be less than end." }
    }

    override fun value(): PlaceholderValue.I32 {
      return PlaceholderValue.I32((start..end).random())
    }
  }

  sealed interface Value<T> : PlaceholderDefinition<T> where T : PlaceholderValue {

    @Serializable
    @SerialName("i32_value")
    private data class I32(private val value: PlaceholderValue.I32) : Value<PlaceholderValue.I32> {
      override fun value(): PlaceholderValue.I32 = value
    }

    @Serializable
    @SerialName("str_value")
    private data class Str(private val value: PlaceholderValue.Str) : Value<PlaceholderValue.Str> {
      override fun value(): PlaceholderValue.Str = value
    }

    companion object {
      @Suppress("UNCHECKED_CAST")
      fun <T> of(value: T): Value<T> where T : PlaceholderValue {
        return when (value) {
          is PlaceholderValue.Str -> Str(value)
          is PlaceholderValue.I32 -> I32(value)
          else -> throw Unreachable("unhandled placeholder value")
        }
          as Value<T>
      }
    }
  }
}
