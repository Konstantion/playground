package com.konstantion.port

import java.util.Optional
import java.util.UUID

interface VariantPort<Entity> : Port where Entity : Any {
  fun deleteById(id: UUID)
  fun findById(id: UUID): Optional<Entity>
  fun save(entry: Entity): Entity
  fun findAll(): List<Entity>
}
