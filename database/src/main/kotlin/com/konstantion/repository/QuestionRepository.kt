package com.konstantion.repository

import com.konstantion.entity.QuestionEntity
import com.konstantion.port.QuestionPort
import com.konstantion.utils.Maybe
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionRepository : JpaRepository<QuestionEntity, UUID>, QuestionPort<QuestionEntity> {
  override fun find(id: UUID): Maybe<QuestionEntity> {
    return Maybe.ofNullable(findById(id).orElse(null))
  }

  override fun findAllByCreatorId(creatorId: UUID): List<QuestionEntity>

  override fun findAllByPublic(public: Boolean): List<QuestionEntity>

  override fun save(entry: QuestionEntity): QuestionEntity {
    return saveAndFlush(entry)
  }
}
