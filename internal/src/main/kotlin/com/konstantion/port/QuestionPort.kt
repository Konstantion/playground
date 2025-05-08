package com.konstantion.port

import java.util.Optional
import java.util.UUID

interface QuestionPort<Entity> : Port where Entity : Any {
  fun deleteById(id: UUID)

  fun findById(id: UUID): Optional<Entity>

  fun findAllByCreatorId(creatorId: UUID): List<Entity>

  fun findAllByPublic(public: Boolean): List<Entity>

  fun save(entry: Entity): Entity

  fun findAll(): List<Entity>
}
