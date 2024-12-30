package com.konstantion.model

sealed interface PlaceholderDefinition<T> where T : PlaceholderValue {
  fun value(): T

  data class RandomOneOf<T>(private val options: List<T>) : PlaceholderDefinition<T> where
  T : PlaceholderValue {
    init {
      check(options.isNotEmpty()) { "Options couldn't be empty." }
    }

    override fun value(): T = options.random()
  }

  sealed interface RandomFromRange<T> : PlaceholderDefinition<T> where
  T : PlaceholderValue,
  T : Comparable<T> {
    data class IntRange(private val start: Int, private val end: Int) :
      RandomFromRange<PlaceholderValue.Num.I32> {
      init {
        check(start <= end) { "Start should be less than end." }
      }

      override fun value(): PlaceholderValue.Num.I32 {
        return PlaceholderValue.Num.I32((start..end).random())
      }
    }
  }

  data class Value<T>(private val value: T) : PlaceholderDefinition<T> where T : PlaceholderValue {
    override fun value(): T = value
  }
}

sealed interface PlaceholderValue {
  data class Str(val value: String) : PlaceholderValue

  sealed interface Num : PlaceholderValue {
    data class I32(val value: Int) : Num, Comparable<I32> {
      override fun compareTo(other: I32): Int {
        return this.value.compareTo(other.value)
      }
    }
  }
}
