package com.konstantion

import com.konstantion.interpreter.PythonCodeInterpreter
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.utils.Either
import java.util.*

fun main() {
  pythonTest()
}

fun pythonTest() {
  val placeholders: LinkedList<PlaceholderLabel> = LinkedList()
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_1, "a")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_2, "b")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_2, "c")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_3, "w")
  val definitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>> =
    mapOf(
      PlaceholderIdentifier.P_1 to PlaceholderDefinition.Value(PlaceholderValue.Num.I32(10)),
      PlaceholderIdentifier.P_2 to PlaceholderDefinition.Value(PlaceholderValue.Num.I32(20)),
      PlaceholderIdentifier.P_3 to PlaceholderDefinition.Value(PlaceholderValue.Str("haha"))
    )

  val code =
    object : Code<Lang.Python, Code.Output.Str> {
      override fun code(): String {
        return """
                    c = b * a
                    a *= 3
                    result = c - a
                    return str(result) + w
                
            """
          .trimIndent()
      }

      override fun lang(): Lang.Python {
        return Lang.Python
      }

      override fun outputType(): Class<Code.Output.Str> {
        return Code.Output.Str::class.java
      }
    }

  val executableCode: String =
    when (val result = PythonCodeInterpreter.toExecutableCode(code, placeholders, definitions)) {
      is Either.Left -> throw IllegalArgumentException(result.value.toString())
      is Either.Right -> result.value
    }

  println(executableCode)
}
