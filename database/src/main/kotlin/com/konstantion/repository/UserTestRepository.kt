package com.konstantion.repository

import com.konstantion.entity.UserTestEntity
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface UserTestRepository : JpaRepository<UserTestEntity, UUID>
