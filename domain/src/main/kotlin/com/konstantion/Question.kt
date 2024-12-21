package com.konstantion

import java.util.LinkedList

class Question<L>(
    private val title: String,
    private val formatAndCode: FormatAndCode,
    private val placeholderDefinitions: Map<PlaceholderLabel, PlaceholderDefinition<*>>,
    private val callArgs: LinkedList<PlaceholderLabel>,
    private val additionalCheck: Code<L, Code.ReturnType.BOOLEAN>? = null,
    private val correctVariant: Variant.Correct<L>,
    private val incorrectVariants: List<Variant.Incorrect<L>>,
) where L : Lang {

  fun variants(): List<Variant<L>> {
    return incorrectVariants + correctVariant
  }

  sealed interface Variant<L> where L : Lang {
    data class Correct<L>(private val code: Code<L, Code.ReturnType.STRING>) : Variant<L> where
    L : Lang

    data class Incorrect<L>(private val code: Code<L, Code.ReturnType.STRING>) : Variant<L> where
    L : Lang
  }
}
