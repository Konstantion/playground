package com.konstantion.model

@JvmInline
value class TaskId(val value: Long) {
  override fun toString(): String = value.toString()
}
