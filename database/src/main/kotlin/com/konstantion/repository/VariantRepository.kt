package com.konstantion.repository

import com.konstantion.entity.VariantEntity
import com.konstantion.port.VariantPort
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VariantRepository : JpaRepository<VariantEntity, UUID>, VariantPort<VariantEntity> {
  override fun save(entry: VariantEntity): VariantEntity {
    return saveAndFlush(entry)
  }
}
