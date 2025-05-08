package com.konstantion.repository

import com.konstantion.entity.CodeEntity
import com.konstantion.port.CodePort
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CodeRepository : JpaRepository<CodeEntity, UUID>, CodePort<CodeEntity> {
  override fun save(entry: CodeEntity): CodeEntity = saveAndFlush(entry)
}
