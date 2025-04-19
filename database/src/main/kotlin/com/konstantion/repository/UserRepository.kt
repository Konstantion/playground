package com.konstantion.repository

import com.konstantion.entity.UserEntity
import com.konstantion.port.Port
import java.util.Optional
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<UserEntity, UUID>, Port {
  fun findByUsername(username: String): Optional<UserEntity>
}
