package com.konstantion.repository

import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.port.Port
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ImmutableTestRepository : JpaRepository<ImmutableTestEntity, UUID>, Port {
  fun findAllByExpiresAfterNotNullAndActive(active: Boolean): List<ImmutableTestEntity>
}
