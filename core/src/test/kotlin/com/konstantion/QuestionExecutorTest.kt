package com.konstantion

import com.konstantion.executor.NaiveQuestionExecutor
import com.konstantion.executor.QuestionExecutor
import com.konstantion.interpreter.PythonCodeInterpreter
import com.konstantion.model.Answer
import com.konstantion.model.Code
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.Question
import com.konstantion.model.QuestionMetadata
import com.konstantion.sandbox.GroupId
import com.konstantion.sandbox.UserBasedSandbox
import com.konstantion.utils.CmdHelper
import com.konstantion.utils.Either
import java.util.UUID
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class QuestionExecutorTest {
  private val log: Logger = LoggerFactory.getLogger(QuestionExecutorTest::class.java)

  @Test
  fun shouldSucceed() {
    val service = service()
    val correct =
      listOf(
        Question.Variant.Correct(
          UUID.randomUUID(),
          Code(
            UUID.randomUUID(),
            """
                        return "hi"
                        """
              .trimIndent(),
            Lang.Python,
            Code.Output.Str::class.java,
          ),
        ),
        Question.Variant.Correct(
          UUID.randomUUID(),
          Code(
            UUID.randomUUID(),
            """
                        return a + c
                        """
              .trimIndent(),
            Lang.Python,
            Code.Output.Str::class.java,
          ),
        ),
      )
    val incorrect =
      listOf(
        Question.Variant.Incorrect(
          UUID.randomUUID(),
          Code(
            UUID.randomUUID(),
            """
                        return str(a) 
                        """
              .trimIndent(),
            Lang.Python,
            Code.Output.Str::class.java,
          ),
        ),
      )

    when (
      val result: Either<QuestionExecutor.Issue, QuestionMetadata> =
        service.run(question(correct, incorrect))
    ) {
      is Either.Left -> fail("Expected success, got error ${result.value}.")
      is Either.Right -> {
        if (result.value.incorrectAnswers.size != 1) {
          fail("Only one incorrect answer should be present, got ${result.value.incorrectAnswers}.")
        }

        if (result.value.correctAnswers.size != 2) {
          fail("Two correct answers expected, got ${result.value.correctAnswers}.")
        }

        if ("hi" !in result.value.correctAnswers.map(Answer::text)) {
          fail("One correct answer should be 'hi', got ${result.value.correctAnswers}")
        }

        log.info("ShouldSucceed[metadata={}]", result)
      }
    }
  }

  @Test
  fun shouldFail() {
    val service = service()
    val incorrect =
      listOf(
        Question.Variant.Incorrect(
          UUID.randomUUID(),
          Code(
            UUID.randomUUID(),
            """
                        return str(a) + 1
                        """
              .trimIndent(),
            Lang.Python,
            Code.Output.Str::class.java,
          ),
        ),
      )

    when (
      val result: Either<QuestionExecutor.Issue, QuestionMetadata> =
        service.run(question(listOf(), incorrect))
    ) {
      is Either.Left -> {
        if (result.value !is QuestionExecutor.Issue.Multiple) {
          fail("Issue should be of multiple, got ${result.value}.")
        }

        if ((result.value as QuestionExecutor.Issue.Multiple).issues.size != 1) {
          fail("Underlying issue should be one, got ${result.value}.")
        }

        log.info("ShouldFail[metadata=$result]")
      }
      is Either.Right -> fail("Expected success, got error ${result.value}.")
    }
  }

  private fun question(
    correct: List<Question.Variant.Correct<Lang.Python>>,
    incorrect: List<Question.Variant.Incorrect<Lang.Python>>,
  ): Question<Lang.Python> =
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
      correctVariants = correct,
      incorrectVariants = incorrect,
    )

  private fun service(): QuestionExecutor<Lang.Python> =
    NaiveQuestionExecutor(sandbox(), GroupId(0))

  private fun sandbox(): UserBasedSandbox<Lang.Python> =
    UserBasedSandbox(
      LoggerFactory::getLogger,
      Lang.Python,
      "kostia",
      CmdHelper.Python3File,
      PythonCodeInterpreter,
    )
}
