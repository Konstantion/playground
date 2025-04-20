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
import com.konstantion.model.User
import com.konstantion.service.QuestionService
import java.util.UUID
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/hello")
class HelloController(private val questionService: QuestionService<QuestionEntity>) {
  @GetMapping
  fun hello(): ResponseEntity<String> {
    return ResponseEntity.ok("hello from the server!")
  }

  @GetMapping("test")
  fun test(): ResponseEntity<String> {
    val question: Question<Lang> =
      Question(
        identifier = UUID.randomUUID(),
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
              Code(null, "asd", Lang.Python, Code.Output.Str::class.java)
            )
          ),
        incorrectVariants = listOf()
      )

    questionService.save(User.admin(), question)

    return ResponseEntity.ok("Hello from the server!")
  }
}
