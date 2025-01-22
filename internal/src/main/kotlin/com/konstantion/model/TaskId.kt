package com.konstantion.model

@JvmInline
value class TaskId(private val value: Long) {
  override fun toString(): String = value.toString()
}
