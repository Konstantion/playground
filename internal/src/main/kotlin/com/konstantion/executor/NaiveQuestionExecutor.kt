package com.konstantion.executor

import com.konstantion.executor.QuestionExecutor.Issue
import com.konstantion.executor.QuestionExecutor.Task
import com.konstantion.model.Answer
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.Question
import com.konstantion.model.QuestionMetadata
import com.konstantion.model.TaskId
import com.konstantion.utils.Either
import com.konstantion.utils.IdGenerator
import com.konstantion.utils.closeForcefully
import com.konstantion.utils.nonNull
import java.util.concurrent.Callable
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future

class NaiveQuestionExecutor<Id, L>(
  private val codeExecutor: CodeExecutor<Id, L>,
  private val id: Id,
  private val executor: ExecutorService =
    Executors.newCachedThreadPool(Thread.ofPlatform().name("naive-question-service", 0).factory()),
) : QuestionExecutor<L> where L : Lang, Id : Any {
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
    val placeholderValues: Map<PlaceholderIdentifier, PlaceholderValue> =
      question.placeholderDefinitions.mapValues { (_, definition) -> definition.value() }

    val results =
      question
        .variants()
        .associateWith { variant ->
          codeExecutor.submit(
            groupId = id,
            code = variant.code,
            callArgs = question.callArgs,
            placeholderValues = placeholderValues,
          )
        }
        .mapValues { (_, task) -> task.id() to task.get() }

    val issues: MutableList<Issue> = mutableListOf()
    val correct: MutableList<Answer> = mutableListOf()
    val incorrect: MutableList<Answer> = mutableListOf()

    results.forEach { (variant, idToResult) ->
      val (id, result) = idToResult
      when (result) {
        is Either.Left -> issues += Issue.VariantExecution(variant, result.value)
        is Either.Right ->
          if (variant.isCorrect()) {
            correct += Answer(variant.identifier.nonNull(), result.value.value, id)
          } else {
            incorrect += Answer(variant.identifier.nonNull(), result.value.value, id)
          }
      }
    }

    return if (issues.isNotEmpty()) {
      Either.left(Issue.Multiple(issues))
    } else {
      Either.right(
        QuestionMetadata(
          question.identifier.nonNull(),
          text = question.body,
          formatAndCode = question.formatAndCode.reformated(placeholderValues),
          correctAnswers = correct,
          incorrectAnswers = incorrect,
        ),
      )
    }
  }

  override fun toString(): String = "NaiveQuestionService[id=$id, codeExecutor=$codeExecutor]"

  override fun close() {
    codeExecutor.close()
    executor.closeForcefully()
  }
}
