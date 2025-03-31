package com.konstantion.repository

import com.konstantion.entity.UserEntity
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface UserRepository : JpaRepository<UserEntity, UUID>
