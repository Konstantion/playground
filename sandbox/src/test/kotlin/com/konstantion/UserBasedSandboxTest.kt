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
import com.konstantion.utils.Either
import java.util.LinkedList
import java.util.concurrent.CountDownLatch
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class UserBasedSandboxTest {
  private val log: Logger = LoggerFactory.getLogger("main")
  private val groupId = GroupId(10L)

  @Test
  fun shouldTimeout() {
    val latch = CountDownLatch(1)
    val sandbox = sandbox()
    val (placeholders, definitions) = placeholdersAndDefinitions()
    val code =
      codeStr(
        """
                c = x * y
                z *= 3
                while True:
                  pass
                result = c - z
                return str(result) + d
            """
          .trimIndent()
      )

    sandbox.subscribe(groupId, listener(latch, log))

    val task = sandbox.submit(groupId, code, placeholders, definitions)

    latch.await()
    sandbox.close()

    when (val result = task.get()) {
      is Either.Left -> {
        if (result.value != CodeExecutor.Issue.CpuTimeExceeded) {
          fail("task should fail because of timeout, got ${result.value}.")
        }

        log.info("Timeout successfully passed {}.", result.value)
      }
      is Either.Right -> fail("task shouldn't return successfully, got ${result.value}.")
    }
  }

  @Test
  fun shouldFailOnMemoryUsage() {
    val latch = CountDownLatch(1)
    val sandbox = sandbox()
    val (placeholders, definitions) = placeholdersAndDefinitions()

    val code =
      codeStr(
        """
        large_data = []
        while True:
            large_data.append("x" * 1000000)
        """
          .trimIndent()
      )

    sandbox.subscribe(groupId, listener(latch, log))

    val task = sandbox.submit(groupId, code, placeholders, definitions)

    latch.await()
    sandbox.close()

    when (val result = task.get()) {
      is Either.Left -> {
        log.info("Memory usage test failed as expected with issue: {}", result.value)
      }
      is Either.Right -> {
        fail("Test should fail on memory usage, but got success: ${result.value}")
      }
    }
  }

  @Test
  fun shouldFailToParse() {
    val latch = CountDownLatch(1)
    val sandbox = sandbox()
    val (placeholders, definitions) = placeholdersAndDefinitions()

    val code =
      codeBool(
        """
        c = x * y
        z *= 2
        result = c + z
        return str(result) + d
        """
          .trimIndent()
      )

    sandbox.subscribe(groupId, listener(latch, log))

    val task = sandbox.submit(groupId, code, placeholders, definitions)

    latch.await()
    sandbox.close()

    when (val result = task.get()) {
      is Either.Left -> {
        if (result.value !is CodeExecutor.Issue.Parse) {
          fail("task should fail because of parsing, got ${result.value}.")
        }

        log.info("Failed to parse successfully {}.", result.value)
      }
      is Either.Right -> {
        fail("Test should fail to parse, but got success: ${result.value}")
      }
    }
  }

  @Test
  fun shouldReturnSuccessfully() {
    val latch = CountDownLatch(1)
    val sandbox = sandbox()
    val (placeholders, definitions) = placeholdersAndDefinitions()

    val code =
      codeStr(
        """
        c = x * y
        z *= 2
        result = c + z
        return str(result) + d
        """
          .trimIndent()
      )

    sandbox.subscribe(groupId, listener(latch, log))

    val task = sandbox.submit(groupId, code, placeholders, definitions)

    latch.await()
    sandbox.close()

    when (val result = task.get()) {
      is Either.Left -> {
        fail("Expected a successful result but got an error: ${result.value}")
      }
      is Either.Right -> {
        log.info("Test succeeded with output: {}", result.value)
      }
    }
  }

  private fun listener(latch: CountDownLatch, log: Logger): CodeExecutor.Listener<GroupId> {
    return object : CodeExecutor.Listener<GroupId> {
      override fun onSuccess(groupId: GroupId, taskId: TaskId, output: Code.Output) {
        log.info("Success groupId={}, taskId={}, output={}.", groupId, taskId, output)
        latch.countDown()
      }

      override fun onError(groupId: GroupId, taskId: TaskId, issue: CodeExecutor.Issue) {
        log.info("Error groupId={}, taskId={}, issue={}.", groupId, taskId, issue)
        latch.countDown()
      }
    }
  }

  private fun codeBool(rawCode: String): Code<Lang.Python, Code.Output.Bool> {
    return object : Code<Lang.Python, Code.Output.Bool> {
      override fun code(): String = rawCode

      override fun lang(): Lang.Python {
        return Lang.Python
      }

      override fun outputType(): Class<Code.Output.Bool> {
        return Code.Output.Bool::class.java
      }
    }
  }

  private fun codeStr(rawCode: String): Code<Lang.Python, Code.Output.Str> {
    return object : Code<Lang.Python, Code.Output.Str> {
      override fun code(): String = rawCode

      override fun lang(): Lang.Python {
        return Lang.Python
      }

      override fun outputType(): Class<Code.Output.Str> {
        return Code.Output.Str::class.java
      }
    }
  }

  private fun placeholdersAndDefinitions():
    Pair<LinkedList<PlaceholderLabel>, Map<PlaceholderIdentifier, PlaceholderDefinition<*>>> {
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
    return placeholders to definitions
  }

  private fun sandbox(): UserBasedSandbox<Lang.Python> {
    return UserBasedSandbox(
      LoggerFactory::getLogger,
      Lang.Python,
      "kostia",
      CmdHelper.Python3File,
      PythonCodeInterpreter
    )
  }
}
