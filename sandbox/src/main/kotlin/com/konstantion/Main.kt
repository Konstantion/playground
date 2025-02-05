package com.konstantion

import com.konstantion.executor.CodeExecutor
import com.konstantion.interpreter.PythonCodeInterpreter
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderDefinition.RandomOneOf
import com.konstantion.model.PlaceholderDefinition.Value
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.PlaceholderValue.Str
import com.konstantion.model.TaskId
import com.konstantion.sandbox.GroupId
import com.konstantion.sandbox.UserBasedSandbox
import com.konstantion.utils.CmdHelper
import com.konstantion.utils.Either
import java.util.LinkedList
import kotlin.random.Random
import org.slf4j.Logger
import org.slf4j.LoggerFactory

fun main() {
  val log: Logger = LoggerFactory.getLogger("main")
  val groupId = GroupId(10L)

  val sandbox: CodeExecutor<GroupId, Lang.Python> =
    UserBasedSandbox(
      LoggerFactory::getLogger,
      Lang.Python,
      "kostia",
      CmdHelper.Python3File,
      PythonCodeInterpreter
    )
  sandbox.subscribe(
    groupId,
    object : CodeExecutor.Listener<GroupId> {
      override fun onSuccess(groupId: GroupId, taskId: TaskId, output: Code.Output) {
        log.info("Success groupId={}, taskId={}, output={}.", groupId, taskId, output)
      }

      override fun onError(groupId: GroupId, taskId: TaskId, issue: CodeExecutor.Issue) {
        log.info("Error groupId={}, taskId={}, issue={}.", groupId, taskId, issue)
      }
    }
  )

  val tasks = sandboxTest(sandbox, groupId)
  var counter = 0
  for (task in tasks) {
    when (task.get()) {
      is Either.Left -> {}
      is Either.Right -> counter++
    }
  }

  sandbox.close()
  println(counter)
}

fun sandboxTest(
  sandbox: CodeExecutor<GroupId, Lang.Python>,
  groupId: GroupId
): MutableList<CodeExecutor.Task<Code.Output.Str>> {
  val placeholders: LinkedList<PlaceholderLabel> = LinkedList()
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_1, "x")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_2, "y")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_2, "z")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_3, "d")
  val definitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>> =
    mapOf(
      PlaceholderIdentifier.P_1 to
        RandomOneOf.of(listOf(PlaceholderValue.I32(10), PlaceholderValue.I32(20))),
      PlaceholderIdentifier.P_2 to PlaceholderDefinition.I32Range(5, 10),
      PlaceholderIdentifier.P_3 to Value.of(Str("haha"))
    )

  val tasks: MutableList<CodeExecutor.Task<Code.Output.Str>> = mutableListOf()

  for (i in 0..40) {
    val rawCode: String =
      if (Random.nextBoolean()) {
        """
          c = x * y
          z *= 3
          result = c - z
          return str(result) + d
              
        """
          .trimIndent()
      } else {
        """
          while True:
            pass
        """
          .trimIndent()
      }

    val code = Code(rawCode, Lang.Python, Code.Output.Str::class.java)

    tasks += sandbox.submit(groupId, code, placeholders, definitions)
  }

  return tasks
}
