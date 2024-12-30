package com.konstantion.interpreter

import com.konstantion.Either
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import java.util.LinkedList

interface CodeInterpreter<L> where L : Lang {
  fun <R> toExecutableCode(
    code: Code<L, R>,
    callArgs: LinkedList<PlaceholderLabel>,
    placeholderDefinitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>>
  ): Either<GeneratorIssue, String> where R : Code.ReturnType
}

sealed interface GeneratorIssue {
  data class VariablesIssue(val description: String) : GeneratorIssue
}
