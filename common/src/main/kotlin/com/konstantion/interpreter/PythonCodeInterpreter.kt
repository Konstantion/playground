package com.konstantion.interpreter

import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe

private val SUPPORTED_VALUE_TYPES: Set<Class<out PlaceholderValue>> =
  setOf(PlaceholderValue.I32::class.java, PlaceholderValue.Str::class.java)

object PythonCodeInterpreter : CodeInterpreter<Lang.Python> {
  override fun <R : Code.Output> toExecutableCode(
    code: Code<Lang.Python, R>,
    callArgs: List<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Either<InterpreterIssue, String> {
    val codeBuilder: StringBuilder = StringBuilder()

    codeBuilder.appendImports()

    when (val maybeIssue = codeBuilder.initVariables(callArgs, placeholderDefinitions)) {
      is Maybe.Just -> return Either.left(maybeIssue.value)
      Maybe.None -> {}
    }

    codeBuilder.initFunction(callArgs, code)
    codeBuilder.defineMainGuard(callArgs)

    return Either.right(codeBuilder.toString())
  }

  private fun StringBuilder.initVariables(
    callArgs: List<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Maybe<InterpreterIssue.Variables> {
    if (callArgs.toSet().size != callArgs.size) {
      return Maybe.just(InterpreterIssue.Variables("variable names should be unique."))
    }

    for (placeholder in callArgs) {
      val definition =
        placeholderDefinitions[placeholder.identifier]
          ?: return Maybe.just(
            InterpreterIssue.Variables("variable definition missing for $placeholder")
          )

      val value: PlaceholderValue = definition.value()

      if (value.javaClass !in SUPPORTED_VALUE_TYPES) {
        return Maybe.just(
          InterpreterIssue.Variables("unsupported variable type ${value.javaClass}")
        )
      }

      val parsedValue: String = value.asString()

      append("${placeholder.name} = $parsedValue$NL")
    }

    return Maybe.none()
  }

  private fun StringBuilder.appendImports() {
    append("import sys$NL")
  }

  private fun <R> StringBuilder.initFunction(
    callArgs: List<PlaceholderLabel>,
    code: Code<Lang.Python, R>
  ) where R : Code.Output {
    this.append("def $USER_FUNCTION_NAME(")
    val argsLine = callArgs.joinToString(", ") { label -> label.name }
    this.append("$argsLine):$NL")

    code.code.lines().forEach { line -> this.append("$PYTHON_INDENT$line$NL") }
  }

  private fun StringBuilder.defineMainGuard(callArgs: List<PlaceholderLabel>) {
    val argsLine = callArgs.joinToString(", ") { label -> label.name }
    append(NL)
    append("if __name__ == \"__main__\":$NL")
    append("${PYTHON_INDENT}try:$NL")
    append("${PYTHON_INDENT}${PYTHON_INDENT}print($USER_FUNCTION_NAME($argsLine))$NL")
    append("${PYTHON_INDENT}except MemoryError:$NL")
    append("${PYTHON_INDENT}${PYTHON_INDENT}sys.exit(139)$NL")
  }

  private fun PlaceholderValue.asString(): String {
    return when (this) {
      is PlaceholderValue.I32 -> this.value.toString()
      is PlaceholderValue.Str -> "\"${this.value.replace("\"", "\\\"")}\""
    }
  }
}
