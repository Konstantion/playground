package com.konstantion.repository

import com.konstantion.entity.Stub
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository interface StubRepository : JpaRepository<Stub, Long>
