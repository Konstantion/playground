package com.konstantion

import com.konstantion.interpreter.PythonCodeInterpreter
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderDefinition.RandomFromRange
import com.konstantion.model.PlaceholderDefinition.RandomOneOf
import com.konstantion.model.PlaceholderDefinition.Value
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue.Num
import com.konstantion.model.PlaceholderValue.Str
import com.konstantion.sandbox.GroupId
import com.konstantion.sandbox.UserBasedSandbox
import com.konstantion.service.CodeExecutor
import com.konstantion.service.TaskId
import com.konstantion.utils.CmdHelper
import java.util.*
import java.util.concurrent.CountDownLatch
import org.slf4j.Logger
import org.slf4j.LoggerFactory

fun main() {
  val log: Logger = LoggerFactory.getLogger("main")
  val groupId = GroupId(10L)

  val latch = CountDownLatch(1)
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
        latch.countDown()
      }

      override fun onError(groupId: GroupId, taskId: TaskId, issue: CodeExecutor.Issue) {
        log.info("Error groupId={}, taskId={}, issue={}.", groupId, taskId, issue)
        latch.countDown()
      }
    }
  )

  sandboxTest(sandbox, groupId)
  latch.await()
  sandbox.close()
}

fun sandboxTest(sandbox: CodeExecutor<GroupId, Lang.Python>, groupId: GroupId) {
  val placeholders: LinkedList<PlaceholderLabel> = LinkedList()
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_1, "x")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_2, "y")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_2, "z")
  placeholders += PlaceholderLabel(PlaceholderIdentifier.P_3, "d")
  val definitions: Map<PlaceholderIdentifier, PlaceholderDefinition<*>> =
    mapOf(
      PlaceholderIdentifier.P_1 to RandomOneOf(listOf(Num.I32(10), Num.I32(20))),
      PlaceholderIdentifier.P_2 to RandomFromRange.IntRange(5, 10),
      PlaceholderIdentifier.P_3 to Value(Str("haha"))
    )

  val code =
    object : Code<Lang.Python, Code.Output.Str> {
      override fun code(): String {
        return """
                    c = x * y
                    z *= 3
                    while True:
                      pass
                    result = c - z
                    return str(result) + d
                
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

  sandbox.submit(groupId, code, placeholders, definitions)
}
