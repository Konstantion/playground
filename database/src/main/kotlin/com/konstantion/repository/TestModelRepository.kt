package com.konstantion.repository

import com.konstantion.entity.TestModelEntity
import com.konstantion.port.TestModelPort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TestModelRepository : TestModelPort<TestModelEntity>, JpaRepository<TestModelEntity, UUID> {
    override fun save(entry: TestModelEntity): TestModelEntity {
        return saveAndFlush(entry)
    }
}