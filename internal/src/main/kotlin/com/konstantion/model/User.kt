package com.konstantion.model

import java.util.UUID

interface User {
  fun id(): UUID

  fun getUsername(): String

  fun getPassword(): String

  fun role(): Role

  fun isAdmin() = role() == Role.Admin

  fun isTeacher() = role() == Role.Teacher

  fun isStudent() = role() == Role.Student

  companion object {
    fun admin(): User =
      object : User {
        override fun id() = UUID.randomUUID()

        override fun getUsername() = "username"

        override fun getPassword(): String = "password"

        override fun role() = Role.Admin
      }
  }
}
