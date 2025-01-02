package com.konstantion.utils

import java.util.concurrent.atomic.AtomicLong as JAtomicLong

sealed interface IdGenerator<Id> where Id : Any {
  fun nextId(): Id

  data class AtomicLong(private val idGen: JAtomicLong = JAtomicLong(0L)) : IdGenerator<Long> {
    override fun nextId(): Long {
      return idGen.getAndIncrement()
    }
  }
}
