package com.konstantion.repository

import com.konstantion.entity.VariantEntity
import com.konstantion.port.VariantPort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface VariantRepository : JpaRepository<VariantEntity, UUID>, VariantPort<VariantEntity> {
    override fun save(entry: VariantEntity): VariantEntity {
        return saveAndFlush(entry)
    }
}