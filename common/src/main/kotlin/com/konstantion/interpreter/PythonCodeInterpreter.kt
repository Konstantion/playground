package com.konstantion.interpreter

import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.utils.Either
import com.konstantion.utils.Maybe

private val SUPPORTED_VALUE_TYPES: Set<Class<out PlaceholderValue>> =
  setOf(PlaceholderValue.I32::class.java, PlaceholderValue.Str::class.java)

private val FORBIDDEN_PYTHON_IMPORTS_OR_KEYWORDS =
  setOf(
    "os",
    "sys",
    "subprocess",
    "shutil",
    "socket",
    "requests",
    "urllib",
    "ctypes",
    "multiprocessing",
    "threading",
    "eval",
    "exec",
    "open",
    "__import__",
    "getattr",
    "setattr",
    "delattr",
  )

object PythonCodeInterpreter : CodeInterpreter<Lang.Python> {
  override fun <R : Code.Output> toExecutableCode(
    code: Code<Lang.Python, R>,
    callArgs: List<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderValue>,
  ): Either<InterpreterIssue, String> {
    when (val forbiddenCheckResult = checkForForbiddenImports(code.code)) {
      is Either.Left -> {
        return Either.left(forbiddenCheckResult.value)
      }
      is Either.Right -> {}
    }

    val codeBuilder: StringBuilder = StringBuilder()

    codeBuilder.appendAllowedImports()

    when (val maybeIssue = codeBuilder.initVariables(callArgs, placeholderDefinitions)) {
      is Maybe.Just -> return Either.left(maybeIssue.value)
      Maybe.None -> {}
    }

    codeBuilder.initFunction(callArgs, code)
    codeBuilder.defineMainGuard(callArgs)

    return Either.right(codeBuilder.toString())
  }

  private fun checkForForbiddenImports(
    userCode: String
  ): Either<InterpreterIssue.ForbiddenImports, Unit> {
    val detected = mutableListOf<String>()

    FORBIDDEN_PYTHON_IMPORTS_OR_KEYWORDS.forEach { forbidden ->
      val pattern = Regex("""(^|\s|[(,;=])\b${Regex.escape(forbidden)}\b([.(]|\s|$)""")
      if (pattern.containsMatchIn(userCode)) {
        detected.add(forbidden)
      }
    }
    return if (detected.isNotEmpty()) {
      Either.left(
        InterpreterIssue.ForbiddenImports(
          "Виявлено використання або імпорт заборонених модулів/ключових слів.",
          detected,
        ),
      )
    } else {
      Either.right(Unit)
    }
  }

  private fun StringBuilder.initVariables(
    callArgs: List<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderValue>,
  ): Maybe<InterpreterIssue.Variables> {
    if (callArgs.toSet().size != callArgs.size) {
      return Maybe.just(
        InterpreterIssue.Variables("Імена змінних (placeholder labels) мають бути унікальними."),
      )
    }

    for (placeholder in callArgs) {
      val placeholderValue =
        placeholderDefinitions[placeholder.identifier]
          ?: return Maybe.just(
            InterpreterIssue.Variables(
              "Відсутнє визначення значення для змінної ${placeholder.name} (ідентифікатор: ${placeholder.identifier})",
            ),
          )

      if (placeholderValue.javaClass !in SUPPORTED_VALUE_TYPES) {
        return Maybe.just(
          InterpreterIssue.Variables(
            "Непідтримуваний тип даних ${placeholderValue.javaClass} для змінної ${placeholder.name}",
          ),
        )
      }

      val parsedValue: String = placeholderValue.asString()

      append("${placeholder.name} = $parsedValue$NL")
    }

    return Maybe.none()
  }

  private fun StringBuilder.appendAllowedImports() {
    append("import time$NL")
  }

  private fun <R> StringBuilder.initFunction(
    callArgs: List<PlaceholderLabel>,
    code: Code<Lang.Python, R>,
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

    append("${PYTHON_INDENT}${PYTHON_INDENT}import sys$NL")
    append("${PYTHON_INDENT}${PYTHON_INDENT}sys.exit(139)$NL")
  }
}
