package com.konstantion.port

import com.konstantion.utils.Maybe
import java.util.UUID

interface QuestionPort<Entity> where Entity : Any {
  fun deleteById(id: UUID)
  fun find(id: UUID): Maybe<Entity>
  fun findAllByCreatorId(creatorId: UUID): List<Entity>
  fun findAllByPublic(public: Boolean): List<Entity>
  fun save(entry: Entity): Entity
  fun findAll(): List<Entity>
}
