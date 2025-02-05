package com.konstantion.utils

object CastHelper {
  fun <I, O> refine(input: I): O where I : Any, O : I {
    return input as O
  }
}
