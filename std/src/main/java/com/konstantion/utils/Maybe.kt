package com.konstantion.utils

import java.util.Optional
import java.util.function.Consumer

sealed interface Maybe<out T> {

  @JvmRecord data class Just<out T>(val value: T) : Maybe<T>

  data object None : Maybe<Nothing>

  companion object {
    @JvmStatic fun <T> of(value: T): Maybe<T> = Just(value)

    @JvmStatic fun <T> empty(): Maybe<T> = None

    @JvmStatic
    fun <T : Any> ofNullable(value: T?): Maybe<T> = if (value == null) None else Just(value)

    @JvmStatic fun <T> just(value: T): Just<T> = Just(value)

    @JvmStatic fun none(): None = None

    @JvmStatic
    fun <T, U> Maybe<T>.orElse(other: U): U where T : U =
      when (this) {
        is Just -> value
        None -> other
      }

    @JvmStatic
    fun <T, U> Maybe<T>.orElseGet(other: () -> U): U where T : U =
      when (this) {
        is Just -> value
        None -> other()
      }

    @JvmStatic
    fun <T : Any> Maybe<T>.toOptional(): Optional<T> =
      when (this) {
        is Just -> Optional.of(value)
        None -> Optional.empty()
      }
  }

  val isPresent: Boolean
    get() = this is Just

  val isEmpty: Boolean
    get() = this is None

  fun ifPresent(action: Consumer<in T>) =
    when (this) {
      is Just -> action.accept(value)
      None -> {}
    }

  fun <U> map(f: (T) -> U): Maybe<U> =
    when (this) {
      is Just -> Just(f(value))
      None -> None
    }

  fun <U> flatMap(f: (T) -> Maybe<U>): Maybe<U> =
    when (this) {
      is Just -> f(value)
      None -> None
    }

  fun <U, V> Maybe<(U) -> V>.ap(maybe: Maybe<U>): Maybe<V> =
    when (this) {
      is Just -> maybe.map(value)
      None -> None
    }

  fun <U, V> zip(other: Maybe<U>, combine: (T, U) -> V): Maybe<V> = flatMap { t ->
    other.map { u -> combine(t, u) }
  }

  fun filter(predicate: (T) -> Boolean): Maybe<T> =
    when (this) {
      is Just -> if (predicate(value)) this else None
      None -> None
    }

  fun orElseThrow(): T = orElseThrow { NoSuchElementException("No value present") }

  fun <X : Throwable> orElseThrow(exceptionSupplier: () -> X) =
    when (this) {
      is Just -> value
      None -> throw exceptionSupplier()
    }
}
