package com.konstantion.repository

import com.konstantion.entity.AnswerEntity
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface AnswerRepository : JpaRepository<AnswerEntity, UUID>
