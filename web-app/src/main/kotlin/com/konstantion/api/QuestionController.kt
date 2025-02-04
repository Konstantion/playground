package com.konstantion.api

import com.konstantion.entity.QuestionEntity
import com.konstantion.model.Code
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.Question
import com.konstantion.repository.QuestionRepository
import java.util.UUID
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonArray
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/questions")
class QuestionController(
  private val repository: QuestionRepository,
  private val questionRepository: QuestionRepository
) {
  @GetMapping
  fun getAllQuestions(): ResponseEntity<String> {
    val toReturn = buildJsonArray {
      repository.findAll().forEach { question ->
        add(
          Json.encodeToJsonElement(
            Question.serializer(Lang.serializer()),
            question.toModel() as Question<Lang>
          )
        )
      }
    }

    return ResponseEntity.ok(toReturn.toString())
  }

  @GetMapping("test")
  fun test(): ResponseEntity<String> {
    val question: Question<Lang> =
      Question(
        lang = Lang.Python,
        body = "body",
        formatAndCode = FormatAndCode("java", "asd"),
        placeholderDefinitions =
          mapOf(
            PlaceholderIdentifier.P_1 to PlaceholderDefinition.Value.of(PlaceholderValue.I32(10)),
            PlaceholderIdentifier.P_2 to PlaceholderDefinition.I32Range(10, 20)
          ),
        callArgs =
          listOf(
            PlaceholderLabel(PlaceholderIdentifier.P_1, "a"),
            PlaceholderLabel(PlaceholderIdentifier.P_1, "b"),
            PlaceholderLabel(PlaceholderIdentifier.P_2, "c")
          ),
        additionalCheck = null,
        correctVariants =
          listOf(
            Question.Variant.Correct(
              UUID.randomUUID(),
              Code("asd", Lang.Python, Code.Output.Str::class.java)
            )
          ),
        incorrectVariants = listOf()
      )

    val entity = QuestionEntity.fromModel(question)
    println(entity)
    repository.save(entity)

    return ResponseEntity.ok("Hello from the server!")
  }
}
