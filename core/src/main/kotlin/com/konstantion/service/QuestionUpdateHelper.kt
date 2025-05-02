package com.konstantion.service

import com.konstantion.entity.CodeEntity
import com.konstantion.entity.QuestionEntity
import com.konstantion.entity.VariantEntity
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.Question
import com.konstantion.port.CodePort
import com.konstantion.port.VariantPort
import com.konstantion.service.QuestionService.UpdateQuestionParams
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.utils.CastHelper.refine
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe
import com.konstantion.utils.Maybe.Companion.asMaybe
import java.util.UUID
import kotlinx.serialization.json.Json
import org.springframework.stereotype.Service

@Service
data class QuestionUpdateHelper(
  private val codePort: CodePort<CodeEntity>,
  private val variantPort: VariantPort<VariantEntity>
) {
  @Suppress("UNCHECKED_CAST")
  fun update(entity: QuestionEntity, params: UpdateQuestionParams): Map<String, List<String>> {
    val validationErrors: MutableMap<String, MutableList<String>> = mutableMapOf()

    fun putViolation(field: String, message: String) {
      validationErrors.computeIfAbsent(field) { mutableListOf() }.add(message)
    }

    val modelView = entity.toModel()

    if (params.body != null) {
      val newBody = params.body!!
      if (newBody.isBlank()) {
        putViolation("body", "Body cannot be blank")
      } else if (newBody.length >= 400) putViolation("body", "Body is too long")
      else {
        entity.body = params.body
      }
    }

    if (params.formatAndCode != null) {
      entity.formatAndCode = Json.encodeToString(FormatAndCode.serializer(), params.formatAndCode!!)
    }

    if (params.placeholderDefinitions != null) {
      val newDefinitions = modelView.placeholderDefinitions.toMutableMap()
      for ((identifier, definition) in params.placeholderDefinitions!!) {
        when (params.action) {
          UpdateQuestionParams.Action.ADD -> {
            newDefinitions[identifier] = definition
          }
          UpdateQuestionParams.Action.REMOVE -> {
            if (newDefinitions.remove(identifier) == null) {
              putViolation(
                "placeholderDefinitions",
                "Placeholder definition with identifier $identifier not found"
              )
            }
          }
        }
      }

      entity.placeholderDefinitions =
        newDefinitions
          .mapKeys { (identifier, _) -> identifier.toString() }
          .mapValues { (_, definition) ->
            Json.encodeToString(
              PlaceholderDefinition.serializer(PlaceholderValue.serializer()),
              refine(definition)
            )
          }
          .toMutableMap()
    }

    if (params.callArgs != null) {
      val newCallArgs = modelView.callArgs.toMutableList()
      for (callArg in params.callArgs!!) {
        when (params.action) {
          UpdateQuestionParams.Action.ADD -> {
            newCallArgs.add(callArg)
          }
          UpdateQuestionParams.Action.REMOVE -> {
            if (!newCallArgs.remove(callArg)) {
              putViolation("callArgs", "Call argument $callArg not found")
            }
          }
        }
      }

      entity.callArgs =
        newCallArgs
          .map { callArg -> Json.encodeToString(PlaceholderLabel.serializer(), callArg) }
          .toMutableList()
    }

    if (params.additionalCheckId != null) {
      when (
        val result: Either<ServiceIssue, Maybe<CodeEntity>> =
          codePort.sqlAction { findById(params.additionalCheckId!!).asMaybe() }
      ) {
        is Either.Left -> putViolation("additionalCheck", result.value.message())
        is Either.Right ->
          when (val maybeCode = result.value) {
            is Maybe.Just -> {
              val code = maybeCode.value
              when (params.action) {
                UpdateQuestionParams.Action.ADD -> {
                  entity.additionalCheck = code
                }
                UpdateQuestionParams.Action.REMOVE -> {
                  entity.additionalCheck = null
                }
              }
            }
            Maybe.None ->
              putViolation(
                "additionalCheck",
                "Additional check with id ${params.additionalCheckId} not found"
              )
          }
      }
    }

    if (params.incorrectVariantId != null) {
      when (
        val newIncorrect: Maybe<List<Question.Variant.Incorrect<Lang>>> =
          handleVariant(
            params.incorrectVariantId!!,
            params.action,
            modelView,
            false,
          ) { message ->
            putViolation("incorrectVariant", message)
          }
            as Maybe<List<Question.Variant.Incorrect<Lang>>>
      ) {
        is Maybe.Just -> {
          entity.incorrectVariants =
            newIncorrect.value.map(VariantEntity::fromIncorrect).toMutableList()
        }
        Maybe.None -> {}
      }
    }

    if (params.correctVariantId != null) {
      when (
        val newCorrect: Maybe<List<Question.Variant.Correct<Lang>>> =
          handleVariant(
            params.correctVariantId!!,
            params.action,
            modelView,
            true,
          ) { message ->
            putViolation("correctVariant", message)
          }
            as Maybe<List<Question.Variant.Correct<Lang>>>
      ) {
        is Maybe.Just -> {
          entity.correctVariants = newCorrect.value.map(VariantEntity::fromCorrect).toMutableList()
        }
        Maybe.None -> {}
      }
    }

    return validationErrors
  }

  private fun handleVariant(
    variantId: UUID,
    action: UpdateQuestionParams.Action,
    modelView: Question<Lang>,
    isCorrect: Boolean,
    putViolation: (String) -> Unit,
  ): Maybe<List<Question.Variant<Lang>>> {
    when (
      val result: Either<ServiceIssue, Maybe<VariantEntity>> =
        variantPort.sqlAction { findById(variantId).asMaybe() }
    ) {
      is Either.Left -> putViolation(result.value.message())
      is Either.Right -> {
        when (val maybeVariant = result.value) {
          is Maybe.Just -> {
            val variant = maybeVariant.value
            val questionVariants: MutableList<Question.Variant<Lang>> =
              if (isCorrect) {
                modelView.correctVariants.toMutableList()
              } else {
                modelView.incorrectVariants.toMutableList()
              }

            when (action) {
              UpdateQuestionParams.Action.ADD -> {
                if (isCorrect) {
                  questionVariants += variant.toCorrect(modelView.lang)
                } else {
                  questionVariants += variant.toIncorrect(modelView.lang)
                }
              }
              UpdateQuestionParams.Action.REMOVE -> {
                if (isCorrect) {
                  questionVariants -= variant.toCorrect(modelView.lang)
                } else {
                  questionVariants -= variant.toIncorrect(modelView.lang)
                }
              }
            }

            return Maybe.Just(questionVariants)
          }
          Maybe.None -> putViolation("Variant with id $variantId not found")
        }
      }
    }

    return Maybe.None
  }
}
