package com.konstantion.entity

import com.konstantion.utils.FieldUtils
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

enum class ImmutableTestStatus {
  ACTIVE,
  ARCHIVED,
}

@Entity
@Table(name = "immutable_test_models")
open class ImmutableTestEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @Column(name = "name", nullable = false) open var name: String? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinTable(
    name = "immutable_test_questions",
    joinColumns = [JoinColumn(name = "immutable_test_id")],
    inverseJoinColumns = [JoinColumn(name = "question_id")],
  )
  open var questions: MutableList<QuestionEntity> = mutableListOf()

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  open var status: ImmutableTestStatus = ImmutableTestStatus.ACTIVE

  @Column(name = "shuffle_questions", nullable = false) open var shuffleQuestions: Boolean = false

  @Column(name = "shuffle_answers", nullable = false) open var shuffleVariants: Boolean = false

  @Column(name = "created_at", nullable = false) open var createdAt: Instant = Instant.now()

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "creator_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  open var creator: UserEntity? = null

  @Column(name = "expires_after", nullable = true) open var expiresAfter: Instant? = null

  @OneToMany(
    mappedBy = "immutableTest",
    cascade = [CascadeType.ALL],
    fetch = FetchType.LAZY,
    orphanRemoval = true,
  )
  open var userTests: MutableList<UserTestEntity> = mutableListOf()

  fun id(): UUID = FieldUtils.nonNull(id)

  fun name(): String = FieldUtils.nonNull(name)

  fun questions(): List<QuestionEntity> = FieldUtils.nonNull(questions)

  fun status(): ImmutableTestStatus = FieldUtils.nonNull(status)

  fun shuffleQuestions(): Boolean = shuffleQuestions

  fun shuffleVariants(): Boolean = shuffleVariants

  fun createdAt(): Instant = FieldUtils.nonNull(createdAt)

  fun creator(): UserEntity? = creator

  fun expiresAfter(): Instant? = expiresAfter

  fun userTests(): List<UserTestEntity> = FieldUtils.nonNull(userTests)
}
