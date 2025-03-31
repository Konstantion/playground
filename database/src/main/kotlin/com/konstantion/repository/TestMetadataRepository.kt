package com.konstantion.repository

import com.konstantion.entity.TestMetadataEntity
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface TestMetadataRepository : JpaRepository<TestMetadataEntity, UUID>
