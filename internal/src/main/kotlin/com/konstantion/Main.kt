package com.konstantion

import com.konstantion.model.Code
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.Question
import java.util.UUID
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

fun main() {
  val lang: Lang = Lang.Python
  println(Json.encodeToString(lang))
  println(
    Json.encodeToString(
      PlaceholderDefinition.serializer(PlaceholderValue.serializer()),
      PlaceholderDefinition.Value.of(PlaceholderValue.Str("asd"))
        as PlaceholderDefinition<PlaceholderValue>,
    ),
  )
  val question: Question<Lang> =
    Question(
      identifier = UUID.randomUUID(),
      lang = Lang.Python,
      body = "body",
      formatAndCode = FormatAndCode("java", "asd"),
      placeholderDefinitions =
        mapOf(
          PlaceholderIdentifier.P_1 to PlaceholderDefinition.Value.of(PlaceholderValue.I32(10)),
          PlaceholderIdentifier.P_2 to PlaceholderDefinition.I32Range(10, 20),
        ),
      callArgs =
        listOf(
          PlaceholderLabel(PlaceholderIdentifier.P_1, "a"),
          PlaceholderLabel(PlaceholderIdentifier.P_1, "b"),
          PlaceholderLabel(PlaceholderIdentifier.P_2, "c"),
        ),
      additionalCheck = null,
      correctVariants =
        listOf(
          Question.Variant.Correct(
            UUID.randomUUID(),
            Code(null, "asd", Lang.Python, Code.Output.Str::class.java),
          ),
        ),
      incorrectVariants = listOf(),
    )
  val encoded = Json.encodeToString(question)
  println(encoded)
  val decoded: Question<Lang> = Json.decodeFromString(encoded)
  println(decoded)
  println(decoded == question)
}
