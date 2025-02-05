package com.konstantion.model

import java.util.UUID

interface User {
  fun id(): UUID

  fun username(): String

  fun role(): Role

  fun permissions(): List<Permission>

  companion object {
    fun admin(): User {
      return object : User {
        override fun id() = UUID.randomUUID()

        override fun username() = "username"

        override fun role() = Role.Admin

        override fun permissions() = emptyList<Permission>()
      }
    }
  }
}
