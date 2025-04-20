package com.konstantion.dto.response

import com.konstantion.entity.UserEntity
import com.konstantion.model.Permission
import com.konstantion.model.Role
import java.util.UUID

data class UserResponse(
  val id: UUID,
  val username: String,
  val role: Role,
  val permissions: Set<Permission>,
  val anonymous: Boolean = false,
) {
  companion object {
    fun fromEntity(entity: UserEntity): UserResponse {
      return UserResponse(
        id = entity.id(),
        username = entity.username(),
        role = entity.role(),
        permissions = entity.permissions,
        anonymous = entity.anonymous,
      )
    }
  }
}
