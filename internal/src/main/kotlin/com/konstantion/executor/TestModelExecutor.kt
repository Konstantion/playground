package com.konstantion.executor

import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.QuestionMetadata
import com.konstantion.model.TaskId
import com.konstantion.model.TestModelMetadata
import com.konstantion.model.TestModel
import com.konstantion.utils.Either
import com.konstantion.utils.IdGenerator
import com.konstantion.utils.closeForcefully
import java.util.concurrent.Callable
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class TestModelExecutor(
  private val questionExecutors: Map<Lang, QuestionExecutor<Lang>>,
) : AutoCloseable {
  private val idGen: IdGenerator<TaskId> = IdGenerator.AtomicLong().andThen(::TaskId)
  private val executor: ExecutorService =
    Executors.newCachedThreadPool(Thread.ofPlatform().name("test-executor", 0).factory())

  @Throws(InterruptedException::class)
  fun run(testModel: TestModel): Either<Issue, TestModelMetadata> {
    val tasks: MutableList<QuestionExecutor.Task> = mutableListOf()
    for (question in testModel.questions) {
      tasks +=
        withExecutor(question.lang) { questionExecutor ->
          questionExecutor.submit(question as Question<Lang>)
        }
    }

    val issues: MutableSet<QuestionExecutor.Issue> = mutableSetOf()
    val questionsMetadata: MutableList<QuestionMetadata> = mutableListOf()
    for (task in tasks) {
      when (val result = task.get()) {
        is Either.Left -> issues += result.value
        is Either.Right -> questionsMetadata += result.value
      }
    }

    return if (issues.isNotEmpty()) {
      Either.Left(Issue.OfQuestion(issues.toList()))
    } else {
      Either.Right(TestModelMetadata(testModel.id, testModel.name, questionsMetadata))
    }
  }

  fun submit(testModel: TestModel): Task {
    val taskId = idGen.nextId()
    val task = executor.submit(Callable { run(testModel) })
    return object : Task {
      override fun id(): TaskId = taskId

      @Throws(InterruptedException::class)
      override fun get(): Either<Issue, TestModelMetadata> = task.get()
    }
  }

  private fun <T> withExecutor(lang: Lang, block: (QuestionExecutor<Lang>) -> T): T where T : Any =
    block(questionExecutors[lang] ?: error("No executor for language $lang"))

  sealed interface Issue {
    data class OfQuestion(val issue: List<QuestionExecutor.Issue>) : Issue
  }

  interface Task {
    fun id(): TaskId

    @Throws(InterruptedException::class) fun get(): Either<Issue, TestModelMetadata>
  }

  override fun close() {
    executor.closeForcefully()
    questionExecutors.forEach { (_, questionExecutors) -> questionExecutors.close() }
  }
}
