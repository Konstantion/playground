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
import jakarta.annotation.PreDestroy
import org.springframework.stereotype.Service
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

private const val VALIDATION_ATTEMPTS: Int = 5
private const val THREAD_NAME: String = "question-validator-"

@Service
class QuestionValidator(
    private val questionPort: QuestionPort<QuestionEntity>,
    private val pythonExecutor: QuestionExecutor<Lang.Python>,
) {
    private val idGenerator: IdGenerator<TaskId> = IdGenerator.AtomicLong(0).andThen(::TaskId)
    private val executor: ExecutorService =
        Executors.newCachedThreadPool(Thread.ofPlatform().name(THREAD_NAME, 0).factory())
    private val statuses: ConcurrentMap<UUID, StatusResponse> = ConcurrentHashMap()

    fun validate(id: UUID, question: Question<Lang>): Either<QuestionService.Issue, TaskId> {
        if (question.lang() == Lang.Python) {
            return Either.left(
                QuestionService.Issue.UnexpectedAction("Python questions are not supported")
            )
        }

        when (val status = statuses[id]) {
            is StatusResponse.Submitted -> return Either.right(status.taskId)
            StatusResponse.Success ->
                return Either.left(
                    QuestionService.Issue.UnexpectedAction("Validation is already successful")
                )

            is StatusResponse.Error ->
                return Either.left(
                    QuestionService.Issue.UnexpectedAction("Validation failed: ${status.message}")
                )

            null, StatusResponse.NotRegistered -> {}
        }

        val taskId: TaskId = idGenerator.nextId()

        require(statuses.put(id, StatusResponse.Submitted(taskId)) == null)

        executor.submit {
            for (attempt in 0..VALIDATION_ATTEMPTS) {
                pythonExecutor.run(refined(question))
            }
        }

        return Either.Right(taskId)
    }

    fun status(id: UUID): StatusResponse {
        return statuses.computeIfAbsent(id) { StatusResponse.NotRegistered }
    }

    fun onUpdated(id: UUID, updated: QuestionEntity) {}
    
    private fun refined(question: Question<Lang>): Question<Lang.Python> {
        return question as Question<Lang.Python>
    }

    @PreDestroy
    fun close() {
    }
}
