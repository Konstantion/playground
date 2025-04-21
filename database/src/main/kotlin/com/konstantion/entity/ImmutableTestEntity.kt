package com.konstantion.entity

import com.konstantion.utils.FieldUtils
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "immutable_test_models")
open class ImmutableTestEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @Column(name = "name", nullable = false) open var name: String? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinTable(
    name = "test_models_questions",
    joinColumns = [JoinColumn(name = "test_model_id")],
    inverseJoinColumns = [JoinColumn(name = "question_id")]
  )
  open var questions: MutableList<QuestionEntity> = mutableListOf()

  @Column(name = "active", nullable = false) open var active: Boolean = true

  @Column(name = "created_at", nullable = false)
  open var createdAt: LocalDateTime = LocalDateTime.now()

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "creator_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  open var creator: UserEntity? = null

  /** The time when the test model expires. If null, the test model does not expire. */
  @Column(name = "expires_after", nullable = true) open var expiresAfter: LocalDateTime? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  open var userTests: MutableList<UserTestEntity> = mutableListOf()

  fun id(): UUID = FieldUtils.nonNull(id)

  fun name(): String = FieldUtils.nonNull(name)

  fun questions(): List<QuestionEntity> = FieldUtils.nonNull(questions)
}
