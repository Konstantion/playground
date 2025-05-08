package com.konstantion.dto.response

import com.konstantion.entity.UserEntity
import com.konstantion.model.Role
import java.util.UUID

data class UserResponse(
  val id: UUID,
  val username: String,
  val role: Role,
  val anonymous: Boolean = false,
) {
  companion object {
    fun UserEntity.asResponse(): UserResponse = fromEntity(this)

    fun fromEntity(entity: UserEntity): UserResponse =
      UserResponse(
        id = entity.id(),
        username = entity.username(),
        role = entity.role(),
        anonymous = entity.anonymous,
      )
  }
}
