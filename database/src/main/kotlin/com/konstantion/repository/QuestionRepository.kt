package com.konstantion.repository

import com.konstantion.entity.QuestionEntity
import com.konstantion.port.QuestionPort
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface QuestionRepository : JpaRepository<QuestionEntity, UUID>, QuestionPort<QuestionEntity> {
  @Query(
    """
    SELECT q 
      FROM QuestionEntity q
      LEFT JOIN q.correctVariants  cv
      LEFT JOIN q.incorrectVariants iv
     WHERE cv.id = :vid
        OR iv.id = :vid
  """
  )
  fun findAllByVariantId(@Param("vid") variantId: UUID): List<QuestionEntity>
  override fun save(entry: QuestionEntity): QuestionEntity {
    return saveAndFlush(entry)
  }
}
