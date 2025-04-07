package com.konstantion.repository

import com.konstantion.entity.UserQuestionAnswerEntity
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface UserQuestionAnswerRepository : JpaRepository<UserQuestionAnswerEntity, UUID>
