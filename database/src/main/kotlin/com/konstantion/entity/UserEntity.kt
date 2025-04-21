package com.konstantion.entity

import com.konstantion.model.Permission
import com.konstantion.model.Role
import com.konstantion.model.User
import com.konstantion.utils.FieldUtils.nonNull
import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.Table
import java.util.UUID

@Table(name = "users")
@Entity
open class UserEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @Column(name = "username", nullable = false, unique = true) open var username: String? = null

  @Column(name = "password", nullable = false) open var password: String? = null

  @Column(name = "role") @Enumerated(EnumType.STRING) open var role: Role? = null

  @ElementCollection(targetClass = Permission::class, fetch = FetchType.LAZY)
  @CollectionTable(name = "user_permissions", joinColumns = [JoinColumn(name = "user_id")])
  @Column(name = "permission")
  @Enumerated(EnumType.STRING)
  open var permissions: MutableSet<Permission> = mutableSetOf()

  @Column(name = "anonymous", nullable = false) open var anonymous: Boolean = false

  fun id(): UUID = nonNull(id)

  fun username(): String = nonNull(username)

  fun password(): String = nonNull(password)

  fun role(): Role = nonNull(role)

  fun asUser(): User {
    return object : User {
      override fun id(): UUID = nonNull(id)

      override fun getUsername(): String = username()

      override fun getPassword(): String = password()

      override fun role(): Role = role()

      override fun permissions(): List<Permission> = permissions.toList()
    }
  }
}
