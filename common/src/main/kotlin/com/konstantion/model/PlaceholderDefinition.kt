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
    fun options(): List<T>

    override fun value(): T = options().random()

    @Serializable
    @SerialName("i32_random_one_of")
    private data class I32(val options: List<Int>) : RandomOneOf<PlaceholderValue.I32> {
      init {
        check(options.isNotEmpty()) { "Options couldn't be empty." }
      }

      override fun options(): List<PlaceholderValue.I32> {
        return options.map(PlaceholderValue::I32)
      }
    }

    @Serializable
    @SerialName("str_random_one_of")
    private data class Str(val options: List<String>) : RandomOneOf<PlaceholderValue.Str> {
      init {
        check(options.isNotEmpty()) { "Options couldn't be empty." }
      }

      override fun options(): List<PlaceholderValue.Str> {
        return options.map(PlaceholderValue::Str)
      }
    }

    companion object {
      @Suppress("UNCHECKED_CAST")
      fun <T> of(options: List<T>): RandomOneOf<PlaceholderValue> {
        return when (options.first()) {
          is Int -> I32(options as List<Int>)
          is String -> Str(options as List<String>)
          else -> throw Unreachable("unhandled placeholder value")
        }
          as RandomOneOf<PlaceholderValue>
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
    private data class I32(private val value: Int) : Value<PlaceholderValue.I32> {
      override fun value(): PlaceholderValue.I32 = PlaceholderValue.I32(value)
    }

    @Serializable
    @SerialName("str_value")
    private data class Str(private val value: String) : Value<PlaceholderValue.Str> {
      override fun value(): PlaceholderValue.Str = PlaceholderValue.Str(value)
    }

    companion object {
      @Suppress("UNCHECKED_CAST")
      fun <T> of(value: T): Value<PlaceholderValue> {
        return when (value) {
          is Int -> I32(value as Int)
          is String -> Str(value as String)
          else -> throw Unreachable("unhandled placeholder value")
        }
          as Value<PlaceholderValue>
      }
    }
  }
}
