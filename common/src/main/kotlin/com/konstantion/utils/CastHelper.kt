package com.konstantion.utils

object CastHelper {
  fun <I, O> refine(input: I): O where I : Any, O : I = input as O
}
