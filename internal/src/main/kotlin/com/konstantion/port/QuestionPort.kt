package com.konstantion.port

import java.util.UUID

interface QuestionPort<Entity> where Entity : Any {
  fun findAllByCreatorId(creatorId: UUID): List<Entity>
  fun findAllByPublic(public: Boolean) : List<Entity>
  fun save(entry: Entity): Entity
  fun findAll(): List<Entity>
}
