package com.konstantion.model

enum class Role {
  Admin,
  Teacher,
  Student;

  fun isIn(vararg roles: Role): Boolean {
    return roles.contains(this)
  }
}
