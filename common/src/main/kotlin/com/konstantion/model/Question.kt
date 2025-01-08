package com.konstantion.model

import java.util.LinkedList
import java.util.UUID

data class Question<L>(
  private val title: String,
  private val formatAndCode: FormatAndCode,
  private val placeholderDefinitions: Map<PlaceholderLabel, PlaceholderDefinition<*>>,
  private val callArgs: LinkedList<PlaceholderLabel>,
  private val additionalCheck: Code<L, Code.Output.Bool>? = null,
  private val correctVariant: Variant.Correct<L>,
  private val incorrectVariants: List<Variant.Incorrect<L>>,
) where L : Lang {

  fun variants(): List<Variant<L>> {
    return incorrectVariants + correctVariant
  }

  sealed interface Variant<L> where L : Lang {
    val id: UUID

    data class Correct<L>(
      override val id: UUID = UUID.randomUUID(),
      private val code: Code<L, Code.Output.Str>
    ) : Variant<L> where L : Lang

    data class Incorrect<L>(
      override val id: UUID = UUID.randomUUID(),
      private val code: Code<L, Code.Output.Str>
    ) : Variant<L> where L : Lang
  }
}
