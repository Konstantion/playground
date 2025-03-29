package com.konstantion.repository

import com.konstantion.entity.CodeEntity
import com.konstantion.port.CodePort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface CodeRepository : JpaRepository<CodeEntity, UUID>, CodePort<CodeEntity> {
    override fun save(entry: CodeEntity): CodeEntity {
        return saveAndFlush(entry)
    }
}