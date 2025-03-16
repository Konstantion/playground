package com.konstantion.interpreter

import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.utils.Either

interface CodeInterpreter<L> where L : Lang {
  fun <R> toExecutableCode(
    code: Code<L, R>,
    callArgs: List<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderValue>
  ): Either<InterpreterIssue, String> where R : Code.Output
}

sealed interface InterpreterIssue {
  data class Variables(val description: String) : InterpreterIssue
}
