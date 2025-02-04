package com.konstantion.repository

import com.konstantion.entity.QuestionEntity
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface QuestionRepository : JpaRepository<QuestionEntity, UUID>
