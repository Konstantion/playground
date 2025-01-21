package com.konstantion.service

import com.konstantion.model.Answer
import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.QuestionMetadata
import com.konstantion.model.TaskId
import com.konstantion.service.QuestionService.Issue
import com.konstantion.service.QuestionService.Task
import com.konstantion.utils.Either
import com.konstantion.utils.IdGenerator
import com.konstantion.utils.closeForcefully
import java.util.concurrent.Callable
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future

class NaiveQuestionService<L>(
  private val codeExecutor: CodeExecutor<Long, L>,
  private val groupId: Long = 0L,
  private val executor: ExecutorService =
    Executors.newCachedThreadPool(Thread.ofPlatform().name("naive-question-service", 0).factory()),
) : QuestionService<L> where L : Lang {

  private val taskIdGen: IdGenerator<TaskId> = IdGenerator.AtomicLong(0).andThen(::TaskId)

  override fun submit(question: Question<L>): Task {
    val taskId: TaskId = taskIdGen.nextId()

    val task: Future<Either<Issue, QuestionMetadata>> = executor.submit(Callable { run(question) })

    return object : Task {
      override fun id(): TaskId = taskId

      @Throws(InterruptedException::class)
      override fun get(): Either<Issue, QuestionMetadata> = task.get()
    }
  }

  @Throws(InterruptedException::class)
  override fun run(question: Question<L>): Either<Issue, QuestionMetadata> {
    val variants =
      question
        .variants()
        .associateWith { variant ->
          codeExecutor.submit(
            groupId = groupId,
            code = variant.code,
            callArgs = question.callArgs(),
            placeholderDefinitions = question.placeholderDefinitions()
          )
        }
        .mapValues { (_, task) -> task.get() }

    val issues: MutableList<Issue> = mutableListOf()
    val correct: MutableList<Answer> = mutableListOf()
    val incorrect: MutableList<Answer> = mutableListOf()

    variants.forEach { (variant, result: Either<CodeExecutor.Issue, Code.Output.Str>) ->
      when (result) {
        is Either.Left -> issues += Issue.VariantExecution(variant, result.value)
        is Either.Right ->
          if (variant.isCorrect()) {
            correct += Answer(variant.id, result.value.value)
          } else {
            incorrect += Answer(variant.id, result.value.value)
          }
      }
    }

    return if (issues.isNotEmpty()) {
      Either.left(Issue.Multiple(issues))
    } else {
      Either.right(
        QuestionMetadata(
          formatAndCode = question.formatAndCode(),
          correctAnswers = correct,
          intersectAnswer = incorrect
        )
      )
    }
  }

  override fun toString(): String =
    "NaiveQuestionService[groupId=$groupId, codeExecutor=$codeExecutor]"

  override fun close() {
    codeExecutor.close()
    executor.closeForcefully()
  }
}
