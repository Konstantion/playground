package com.konstantion.repository

import com.konstantion.entity.QuestionMetadataEntity
import com.konstantion.port.Port
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository interface QuestionMetadataRepository : JpaRepository<QuestionMetadataEntity, UUID>, Port
