package com.konstantion.repository

import com.konstantion.entity.ImmutableTestEntity
import com.konstantion.entity.ImmutableTestStatus
import com.konstantion.port.Port
import java.time.Instant
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ImmutableTestRepository : JpaRepository<ImmutableTestEntity, UUID>, Port {
  fun findAllByExpiresAfterNotNullAndStatus(
    immutableTestStatus: ImmutableTestStatus
  ): List<ImmutableTestEntity>

  fun findAllByCreatorId(creatorId: UUID): List<ImmutableTestEntity>

  fun findByStatusAndExpiresAfterBefore(
    status: ImmutableTestStatus,
    expiresAfter: Instant,
  ): List<ImmutableTestEntity>
}
