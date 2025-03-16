package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.executor.QuestionExecutor
import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.TaskId
import com.konstantion.port.QuestionPort
import com.konstantion.service.QuestionService.StatusResponse
import com.konstantion.utils.Either
import com.konstantion.utils.IdGenerator
import com.konstantion.utils.closeForcefully
import jakarta.annotation.PreDestroy
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.locks.Lock
import kotlin.concurrent.withLock
import org.slf4j.Logger
import org.slf4j.LoggerFactory

private const val VALIDATION_ATTEMPTS: Int = 5
private const val THREAD_NAME: String = "question-validator-"

class QuestionValidator(
  private val sqlLock: Lock,
  private val questionPort: QuestionPort<QuestionEntity>,
  private val pythonExecutor: QuestionExecutor<Lang.Python>,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)
  private val idGenerator: IdGenerator<TaskId> = IdGenerator.AtomicLong(0).andThen(::TaskId)
  private val executor: ExecutorService =
    Executors.newCachedThreadPool(Thread.ofPlatform().name(THREAD_NAME, 0).factory())
  private val statuses: ConcurrentMap<UUID, StatusResponse> = ConcurrentHashMap()

  fun validate(questionEntity: QuestionEntity) =
    validate(questionEntity.id(), questionEntity.toModel())

  private fun validate(id: UUID, question: Question<Lang>): Either<QuestionService.Issue, TaskId> {
    if (question.lang == Lang.Python) {
      return Either.left(
        QuestionService.Issue.UnexpectedAction("Python questions are not supported")
      )
    }

    when (val status = status(id)) {
      is StatusResponse.Submitted -> return Either.right(status.taskId)
      StatusResponse.Success ->
        return Either.left(
          QuestionService.Issue.UnexpectedAction("Validation is already successful")
        )
      is StatusResponse.Error ->
        return Either.left(
          QuestionService.Issue.UnexpectedAction(
            "Validation failed: ${status.message}, fix question."
          )
        )
      StatusResponse.NotRegistered -> {}
    }

    val taskId: TaskId = idGenerator.nextId()

    require(statuses.put(id, StatusResponse.Submitted(taskId)) is StatusResponse.NotRegistered)

    executor.submit {
      var failed = false
      for (attempt in 0..VALIDATION_ATTEMPTS) {
        val result = pythonExecutor.run(refined(question))
        if (result is Either.Left) {
          val issue = result.value
          log.warn("Failed to validate question id={}, issue={}", id, issue)
          failed = true
          require(
            statuses.put(id, StatusResponse.Error(issue.toString())) is StatusResponse.Submitted
          )
          break
        }
      }

      if (!failed) {
        sqlLock.withLock {
          log.info("Question with id={}, successfully validated", id)
          val entity = questionPort.find(id).orElseThrow()
          entity.validated = true
          questionPort.save(entity)
          require(statuses.put(id, StatusResponse.Success) is StatusResponse.Submitted)
        }
      }
    }

    return Either.Right(taskId)
  }

  fun status(id: UUID): StatusResponse {
    return statuses.computeIfAbsent(id) { StatusResponse.NotRegistered }
  }

  /** if it's called while we validation some issue, we are cooked */
  fun onInvalidated(updated: QuestionEntity) {
    sqlLock.withLock {
      when (status(updated.id())) {
        StatusResponse.NotRegistered -> {}
        else -> {
          val oldStatus = statuses.put(updated.id(), StatusResponse.NotRegistered)
          updated.validated = false
          questionPort.save(updated)
          log.info("Invalidated question with id={}, oldStatus={}.", updated.id(), oldStatus)
        }
      }
    }
  }

  private fun refined(question: Question<Lang>): Question<Lang.Python> {
    return question as Question<Lang.Python>
  }

  @PreDestroy
  fun close() {
    executor.closeForcefully()
  }
}
