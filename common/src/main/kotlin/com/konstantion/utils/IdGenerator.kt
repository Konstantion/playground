package com.konstantion.utils

import java.util.concurrent.atomic.AtomicLong as JAtomicLong

interface IdGenerator<Id> where Id : Any {
  fun nextId(): Id

  data class AtomicLong(
    private val idGen: JAtomicLong = JAtomicLong(0L),
  ) : IdGenerator<Long> {
    constructor(first: Long) : this(JAtomicLong(first))

    override fun nextId(): Long = idGen.getAndIncrement()
  }

  fun <T> andThen(mapper: (Id) -> T): IdGenerator<T> where T : Any =
    object : IdGenerator<T> {
      override fun nextId(): T = mapper(this@IdGenerator.nextId())
    }
}
