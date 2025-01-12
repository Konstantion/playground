package com.konstantion.service

import com.konstantion.model.Code
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.Question
import kotlinx.serialization.json.Json
import java.util.UUID

fun main() {
    val question: Question<Lang.Python> = Question(
        body = "body",
        formatAndCode = FormatAndCode("java", "asd"),
        placeholderDefinitions = mapOf(),
        callArgs = listOf(),
        additionalCheck = null,
        correctVariant = Question.Variant.Correct(UUID.randomUUID(), Code("asd", Lang.Python, Code.Output.Str::class.java)),
        incorrectVariants = listOf()
    )
    val encoded = Json.encodeToString(Question.serializer(Lang.Python.serializer()), question)
    println(encoded)
    val decoded = Json.decodeFromString<Question<Lang.Python>>(encoded)
    println(decoded)
    println(decoded == question)
}
