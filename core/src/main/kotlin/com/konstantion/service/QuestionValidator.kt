package com.konstantion.service

import com.konstantion.entity.QuestionEntity
import com.konstantion.executor.QuestionExecutor
import com.konstantion.model.Answer
import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.model.QuestionMetadata
import com.konstantion.model.TaskId
import com.konstantion.port.QuestionPort
import com.konstantion.service.QuestionService.StatusResponse
import com.konstantion.service.SqlHelper.sqlAction
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
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

private const val VALIDATION_ATTEMPTS: Int = 80
private const val SUCCESS_FACTOR = 0.2F
private const val THREAD_NAME: String = "question-validator-"

@Service
data class QuestionValidator(
  private val questionPort: QuestionPort<QuestionEntity>,
  private val pythonExecutor: QuestionExecutor<Lang.Python>,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)
  private val idGenerator: IdGenerator<TaskId> = IdGenerator.AtomicLong(0).andThen(::TaskId)
  private val executor: ExecutorService =
    Executors.newCachedThreadPool(Thread.ofPlatform().name(THREAD_NAME, 0).factory())
  private val statuses: ConcurrentMap<UUID, StatusResponse> = ConcurrentHashMap()
  private val lock: Lock = ReentrantLock()

  fun validate(questionEntity: QuestionEntity) =
    lock.withLock { validate(questionEntity.id(), questionEntity.toModel()) }

  private fun validate(id: UUID, question: Question<Lang>): Either<ServiceIssue, TaskId> =
    lock.withLock {
      if (question.lang != Lang.Python) {
        return Either.left(UnexpectedAction("Python questions are not supported"))
      }

      when (val status = status(id)) {
        is StatusResponse.Submitted -> return Either.right(status.taskId)
        StatusResponse.Success ->
          return Either.left(UnexpectedAction("Validation is already successful"))
        is StatusResponse.Error ->
          return Either.left(
            UnexpectedAction("Validation failed: ${status.message}, fix question.")
          )
        StatusResponse.NotRegistered -> {}
      }

      val taskId: TaskId = idGenerator.nextId()

      val task =
        executor.submit {
          var failed = false
          val metadatas: MutableList<QuestionMetadata> = mutableListOf()
          for (attempt in 0 ..< VALIDATION_ATTEMPTS) {
            if (failed) {
              break
            }

            when (
              val result: Either<QuestionExecutor.Issue, QuestionMetadata> =
                pythonExecutor.run(refined(question))
            ) {
              is Either.Left ->
                lock.withLock {
                  val issue = result.value
                  log.warn("Failed to validate question id={}, issue={}", id, issue)
                  failed = true
                  when (status(id)) {
                    is StatusResponse.Submitted ->
                      statuses.put(id, StatusResponse.Error(issue.toString())) is
                        StatusResponse.Submitted
                    is StatusResponse.NotRegistered ->
                      log.warn("Question was invalidated, while submitted")
                    else -> error("Unexpected status: ${status(id)}")
                  }
                }
              is Either.Right -> metadatas += result.value
            }
          }

          if (!failed) {
            lock.withLock {
              val uniqueIssues = mutableSetOf<String>()

              check(metadatas.isNotEmpty() && metadatas.size == VALIDATION_ATTEMPTS)

              val badMetadatas = mutableSetOf<QuestionMetadata>()
              for (metadata in metadatas) {
                if (metadata.correctAnswers.isEmpty()) {
                  badMetadatas += metadata
                  uniqueIssues +=
                    "No correct answers were returned for question with id=${metadata.questionIdentifier}"
                }

                if (metadata.incorrectAnswers.isEmpty()) {
                  badMetadatas += metadata
                  uniqueIssues +=
                    "No incorrect answers were returned for question with id=${metadata.questionIdentifier}"
                }

                metadata.answers().forEach { answer ->
                  if (answer.text.isEmpty()) {
                    badMetadatas += metadata
                    uniqueIssues += "Correct answer with id=${answer.variantIdentifier} is empty"
                  }

                  val sameCorrect =
                    metadata.correctAnswers.filter { correctAnswer ->
                      correctAnswer.text == answer.text &&
                        correctAnswer.variantIdentifier != answer.variantIdentifier
                    }

                  if (sameCorrect.isNotEmpty()) {
                    badMetadatas += metadata
                    uniqueIssues +=
                      "Answer with id=${answer.variantIdentifier} is same as " +
                        "correct answers with ids=${
                                sameCorrect.map(Answer::variantIdentifier).joinToString(", ")
                              }"
                  }

                  val sameIncorrect =
                    metadata.incorrectAnswers.filter { incorrectAnswer ->
                      incorrectAnswer.text == answer.text &&
                        incorrectAnswer.variantIdentifier != answer.variantIdentifier
                    }

                  if (sameIncorrect.isNotEmpty()) {
                    badMetadatas += metadata
                    uniqueIssues +=
                      "Answer with id=${answer.variantIdentifier} is same as " +
                        "incorrect answers with ids=${
                                sameIncorrect.map(Answer::variantIdentifier).joinToString(", ")
                              }"
                  }
                }
              }

              val badFactor = badMetadatas.size.toDouble() / metadatas.size.toDouble()
              if (badFactor > SUCCESS_FACTOR) {
                log.warn("Question with id={} has incorrect answers: {}", id, uniqueIssues)
                when (status(id)) {
                  is StatusResponse.Submitted ->
                    require(
                      statuses.put(id, StatusResponse.Error(uniqueIssues.joinToString(".\n")))
                        is StatusResponse.Submitted
                    )
                  is StatusResponse.NotRegistered ->
                    log.warn("Question was invalidated, while submitted")
                  else -> error("Unexpected status: ${status(id)}")
                }

                return@submit
              }

              when (status(id)) {
                is StatusResponse.Submitted -> {
                  questionPort.sqlAction {
                    log.info("Question with id={}, successfully validated", id)
                    val entity = findById(id).orElseThrow()
                    entity.validated = true
                    save(entity)
                    require(statuses.put(id, StatusResponse.Success) is StatusResponse.Submitted)
                  }
                }
                is StatusResponse.NotRegistered ->
                  log.warn("Question was invalidated, while submitted")
                else -> error("Unexpected status: ${status(id)}")
              }
            }
          }
        }

      require(
        statuses.put(id, StatusResponse.Submitted(taskId, task)) is StatusResponse.NotRegistered
      )

      return Either.Right(taskId)
    }

  fun status(id: UUID): StatusResponse =
    lock.withLock {
      return statuses.computeIfAbsent(id) { StatusResponse.NotRegistered }
    }

  fun setOrGetStatus(question: QuestionEntity): StatusResponse =
    lock.withLock {
      return when (val status: StatusResponse = status(question.id())) {
        StatusResponse.NotRegistered -> {
          if (question.validated()) {
            statuses[question.id()] = StatusResponse.Success
            StatusResponse.Success
          } else {
            status
          }
        }
        else -> status
      }
    }

  /** if it's called while we validation some issue, we are cooked */
  fun onInvalidated(updated: QuestionEntity) =
    lock.withLock {
      questionPort.sqlAction {
        when (status(updated.id())) {
          StatusResponse.NotRegistered -> {
            updated.validated = false
            save(updated)
            log.info("Invalidated question with not registered id={}", updated.id())
          }
          else -> {
            val oldStatus = statuses.put(updated.id(), StatusResponse.NotRegistered)
            if (oldStatus is StatusResponse.Submitted) {
              oldStatus.task.cancel(true)
            }
            updated.validated = false
            save(updated)
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
