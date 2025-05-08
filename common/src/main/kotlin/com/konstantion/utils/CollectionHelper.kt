package com.konstantion.utils

fun <T, V> List<T>.withValues(transformer: (T) -> V): Map<T, V> where T : Any, V : Any =
  this.associateWith(transformer)
