package com.konstantion.model

import com.konstantion.model.serializaers.OutputTypeSerializer
import com.konstantion.model.serializaers.UUIDSerializer
import java.util.UUID
import kotlinx.serialization.Serializable

@Serializable
data class Question<L>(
  private val lang: L,
  private val body: String,
  private val formatAndCode: FormatAndCode,
  private val placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>,
  private val callArgs: List<PlaceholderLabel>,
  private val additionalCheck:
    Code<L, @Serializable(with = OutputTypeSerializer::class) Code.Output.Bool>? =
    null,
  private val correctVariants: List<Variant.Correct<L>>,
  private val incorrectVariants: List<Variant.Incorrect<L>>,
) where L : Lang {

  fun lang(): L = lang

  fun body() = body

  fun formatAndCode(): FormatAndCode = formatAndCode

  fun callArgs(): List<PlaceholderLabel> = callArgs

  fun placeholderDefinitions(): Map<PlaceholderIdentifier, PlaceholderDefinition<*>> =
    placeholderDefinitions

  fun additionalCheck(): Code<L, Code.Output.Bool>? = additionalCheck

  fun correctVariants(): List<Variant.Correct<L>> = correctVariants

  fun incorrectVariants(): List<Variant.Incorrect<L>> = incorrectVariants

  fun variants(): List<Variant<L>> = incorrectVariants + correctVariants

  @Serializable
  sealed interface Variant<L> where L : Lang {
    val id: UUID
    val code: Code<L, Code.Output.Str>

    fun isCorrect(): Boolean = this is Correct

    @Serializable
    data class Correct<L>(
      @Serializable(with = UUIDSerializer::class) override val id: UUID = UUID.randomUUID(),
      override val code: Code<L, @Serializable(with = OutputTypeSerializer::class) Code.Output.Str>
    ) : Variant<L> where L : Lang

    @Serializable
    data class Incorrect<L>(
      @Serializable(with = UUIDSerializer::class) override val id: UUID = UUID.randomUUID(),
      override val code: Code<L, @Serializable(with = OutputTypeSerializer::class) Code.Output.Str>
    ) : Variant<L> where L : Lang
  }
}
