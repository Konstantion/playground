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
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "user_tests")
open class UserTestEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @ManyToOne
  @JoinColumn(name = "test_model_id", nullable = false)
  open var immutableTest: ImmutableTestEntity? = null

  @OneToOne(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinColumn(name = "test_metadata_id", nullable = false)
  open var testMetadata: TestMetadataEntity? = null

  @OneToOne @JoinColumn(name = "user_id", nullable = false) open var user: UserEntity? = null

  @OneToMany
  @JoinColumn(name = "user_qeustion_answer_id", nullable = false)
  open var questionAnswers: MutableList<UserQuestionAnswerEntity> = mutableListOf()

  @Column(name = "active", nullable = false) open var active: Boolean = true

  fun user(): UserEntity = FieldUtils.nonNull(user)

  fun id(): UUID = FieldUtils.nonNull(id)
  fun immutableTest(): ImmutableTestEntity = FieldUtils.nonNull(immutableTest)
  fun testMetadata(): TestMetadataEntity = FieldUtils.nonNull(testMetadata)
  fun questionAnswers(): List<UserQuestionAnswerEntity> = FieldUtils.nonNull(questionAnswers)
  fun active(): Boolean = active
}
