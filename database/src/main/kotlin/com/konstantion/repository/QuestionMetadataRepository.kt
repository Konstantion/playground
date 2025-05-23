package com.konstantion.repository

import com.konstantion.entity.QuestionMetadataEntity
import com.konstantion.port.Port
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionMetadataRepository : JpaRepository<QuestionMetadataEntity, UUID>, Port
