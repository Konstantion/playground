package com.konstantion.repository

import com.konstantion.entity.TestModelEntity
import com.konstantion.port.TestModelPort
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TestModelRepository :
  TestModelPort<TestModelEntity>, JpaRepository<TestModelEntity, UUID> {
  override fun findAllByCreatorId(creatorId: UUID): List<TestModelEntity>

  override fun save(entry: TestModelEntity): TestModelEntity = saveAndFlush(entry)
}
