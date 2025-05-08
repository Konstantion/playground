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
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

enum class UserTestStatus {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
  ABANDONED,
  EXPIRED,
  CANCELLED,
}

@Entity
@Table(name = "user_tests")
open class UserTestEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "immutable_test_id", nullable = false)
  open var immutableTest: ImmutableTestEntity? = null

  @OneToOne(
    cascade = [CascadeType.ALL],
    fetch = FetchType.EAGER,
    orphanRemoval = true,
  ) // Added orphanRemoval
  @JoinColumn(name = "test_metadata_id", nullable = false, unique = true)
  open var testMetadata: TestMetadataEntity? = null

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  open var user: UserEntity? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinTable(
    name = "user_test_question_answers_mapping",
    joinColumns = [JoinColumn(name = "user_test_id")],
    inverseJoinColumns =
      [
        JoinColumn(name = "user_question_answer_id", unique = true),
      ], // Ensure answer mapping is unique if needed
  )
  open var questionAnswers: MutableList<UserQuestionAnswerEntity> = mutableListOf()

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  open var status: UserTestStatus = UserTestStatus.NOT_STARTED

  @Column(name = "started_at", nullable = true) open var startedAt: Instant? = null

  @Column(name = "completed_at", nullable = true) open var completedAt: Instant? = null

  @Column(name = "score", nullable = true) open var score: Double? = null

  // --- Getters ---
  fun id(): UUID = FieldUtils.nonNull(id)

  fun immutableTest(): ImmutableTestEntity = FieldUtils.nonNull(immutableTest)

  fun testMetadata(): TestMetadataEntity = FieldUtils.nonNull(testMetadata)

  fun user(): UserEntity = FieldUtils.nonNull(user)

  fun questionAnswers(): List<UserQuestionAnswerEntity> = FieldUtils.nonNull(questionAnswers)

  fun status(): UserTestStatus = FieldUtils.nonNull(status)

  fun startedAt(): Instant? = startedAt

  fun completedAt(): Instant? = completedAt

  fun score(): Double? = score
}
