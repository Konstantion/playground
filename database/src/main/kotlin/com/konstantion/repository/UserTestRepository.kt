package com.konstantion.repository

import com.konstantion.entity.UserTestEntity
import com.konstantion.port.Port
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserTestRepository : JpaRepository<UserTestEntity, UUID>, Port {
  fun findByUserId(userId: UUID): List<UserTestEntity>
}
