package com.konstantion.utils

fun <T> T?.nonNull(): T {
  return this ?: error("shouldn't be null")
}
