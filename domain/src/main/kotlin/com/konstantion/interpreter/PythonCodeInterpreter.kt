package com.konstantion.interpreter

import com.konstantion.Either
import com.konstantion.Maybe
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import java.util.LinkedList
import jdk.javadoc.internal.doclets.formats.html.markup.Text.NL

private val SUPPORTED_VALUE_TYPES: Set<Class<out PlaceholderValue>> =
  setOf(PlaceholderValue.Num.I32::class.java, PlaceholderValue.Str::class.java)

object PythonCodeInterpreter : CodeInterpreter<Lang.Python> {
  override fun <R : Code.ReturnType> toExecutableCode(
    code: Code<Lang.Python, R>,
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Either<GeneratorIssue, String> {
    val codeBuilder: StringBuilder = StringBuilder()

    when (val maybeIssue = codeBuilder.initVariables(callArgs, placeholderDefinitions)) {
      is Maybe.Just -> return Either.left(maybeIssue.value)
      Maybe.None -> {}
    }

    codeBuilder.initFunction(callArgs, code)

    return Either.right(codeBuilder.toString())
  }

  private fun StringBuilder.initVariables(
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Maybe<GeneratorIssue.VariablesIssue> {
    if (callArgs.toSet().size != callArgs.size) {
      return Maybe.just(GeneratorIssue.VariablesIssue("variable names should be unique."))
    }

    for (placeholder in callArgs) {
      val definition =
        placeholderDefinitions[placeholder.identifier]
          ?: return Maybe.just(
            GeneratorIssue.VariablesIssue("variable definition missing for $placeholder")
          )

      val value: PlaceholderValue = definition.value()

      if (value.javaClass !in SUPPORTED_VALUE_TYPES) {
        return Maybe.just(
          GeneratorIssue.VariablesIssue("unsupported variable type ${value.javaClass}")
        )
      }

      val parsedValue: String = value.asString()

      append("${placeholder.name} = $parsedValue$NL")
    }

    return Maybe.none()
  }

  private fun <R> StringBuilder.initFunction(
    callArgs: LinkedList<PlaceholderLabel>,
    code: Code<Lang.Python, R>
  ) where R : Code.ReturnType {
    this.append("def $USER_FUNCTION_NAME(")
    val argsLine = callArgs.joinToString(", ") { label -> label.name }
    this.append("$argsLine):$NL")

    code.code().lines().forEach { line -> this.append("$PYTHON_INDENT$line$NL") }

    this.append("${NL}if __name__ == \"__main__\":$NL")
    this.append("$PYTHON_INDENT${PYTHON_INDENT}print($USER_FUNCTION_NAME($argsLine))")
  }

  private fun PlaceholderValue.asString(): String {
    return when (this) {
      is PlaceholderValue.Num.I32 -> this.value.toString()
      is PlaceholderValue.Str -> "\"${this.value.replace("\"", "\\\"")}\""
    }
  }
}
