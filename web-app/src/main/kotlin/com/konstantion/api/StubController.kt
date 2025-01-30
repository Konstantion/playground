package com.konstantion.api

import com.konstantion.entity.Stub
import com.konstantion.repository.StubRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/stubs")
class StubController(
    private val repository: StubRepository
) {

    @GetMapping
    fun getAll(): ResponseEntity<List<Stub>> {
        return ResponseEntity.ok(repository.findAll())
    }

    @PostMapping
    fun create(): ResponseEntity<Stub> {
        val stub = repository.save(Stub())
        return ResponseEntity.ok(stub)
    }
}
