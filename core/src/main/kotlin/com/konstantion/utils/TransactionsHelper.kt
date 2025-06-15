package com.konstantion.utils

import com.konstantion.service.ServiceIssue
import com.konstantion.service.UnexpectedAction
import java.util.UUID
import org.springframework.stereotype.Service
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.TransactionStatus
import org.springframework.transaction.support.DefaultTransactionDefinition

@Service
data class TransactionsHelper(
  private val txManager: PlatformTransactionManager,
) {
  fun <R : Any> tx(block: () -> Either<ServiceIssue, R>): Either<ServiceIssue, R> {
    val def =
      DefaultTransactionDefinition().apply {
        name = "tx:${UUID.randomUUID()}"
        propagationBehavior = DefaultTransactionDefinition.PROPAGATION_REQUIRES_NEW
      }

    val status: TransactionStatus = txManager.getTransaction(def)

    return try {
      val result = block()
      if (result is Either.Left) {
        status.setRollbackOnly()
      }

      txManager.commit(status)
      result
    } catch (unexpected: Throwable) {
      Either.left(
        UnexpectedAction(
          action = unexpected.message ?: "Unexpected error",
        ),
      )
    }
  }
}
