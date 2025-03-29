package com.konstantion.repository

import com.konstantion.entity.QuestionEntity
import com.konstantion.port.QuestionPort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface QuestionRepository : JpaRepository<QuestionEntity, UUID>, QuestionPort<QuestionEntity> {
  override fun save(entry: QuestionEntity): QuestionEntity {
    return saveAndFlush(entry)
  }
}
