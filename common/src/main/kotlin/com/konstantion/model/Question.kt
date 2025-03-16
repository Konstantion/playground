package com.konstantion.model

import com.konstantion.model.serializaers.OutputTypeSerializer
import com.konstantion.model.serializaers.UUIDSerializer
import java.util.UUID
import kotlinx.serialization.Serializable

@Serializable
data class Question<L>(
  @Serializable(with = UUIDSerializer::class) val identifier: UUID,
  val lang: L,
  val body: String,
  val formatAndCode: FormatAndCode,
  val placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>,
  val callArgs: List<PlaceholderLabel>,
  val additionalCheck:
    Code<L, @Serializable(with = OutputTypeSerializer::class) Code.Output.Bool>? =
    null,
  val correctVariants: List<Variant.Correct<L>>,
  val incorrectVariants: List<Variant.Incorrect<L>>,
) where L : Lang {

  fun variants(): List<Variant<L>> = incorrectVariants + correctVariants

  @Serializable
  sealed interface Variant<L> where L : Lang {
    val identifier: UUID
    val code: Code<L, Code.Output.Str>

    fun isCorrect(): Boolean = this is Correct

    @Serializable
    data class Correct<L>(
      @Serializable(with = UUIDSerializer::class) override val identifier: UUID = UUID.randomUUID(),
      override val code: Code<L, @Serializable(with = OutputTypeSerializer::class) Code.Output.Str>
    ) : Variant<L> where L : Lang

    @Serializable
    data class Incorrect<L>(
      @Serializable(with = UUIDSerializer::class) override val identifier: UUID = UUID.randomUUID(),
      override val code: Code<L, @Serializable(with = OutputTypeSerializer::class) Code.Output.Str>
    ) : Variant<L> where L : Lang
  }
}
