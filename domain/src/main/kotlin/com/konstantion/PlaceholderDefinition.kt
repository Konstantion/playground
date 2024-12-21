package com.konstantion

sealed interface PlaceholderDefinition<T> where T : Any {
  fun value(): T

  data class RandomOneOf<T>(private val options: List<T>) : PlaceholderDefinition<T> where T : Any {
    init {
      check(options.isNotEmpty()) { "Options couldn't be empty." }
    }

    override fun value(): T = options.random()
  }

  sealed interface RandomFromRange<T> : PlaceholderDefinition<T> where T : Any, T : Comparable<T> {
    data class IntFromRange(private val start: Int, private val end: Int) :
        PlaceholderDefinition<Int> {
      init {
        check(start <= end) { "Start should be less than end." }
      }

      override fun value(): Int {
        return (start..end).random()
      }
    }
  }
}
