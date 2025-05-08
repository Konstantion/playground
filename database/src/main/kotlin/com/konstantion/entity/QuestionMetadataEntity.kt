package com.konstantion.entity

import com.konstantion.utils.FieldUtils.nonNull
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
import java.util.UUID

@Entity
@Table(name = "question_metadata")
open class QuestionMetadataEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "test_metadata_id", nullable = false)
  open var testMetadata: TestMetadataEntity? = null

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "question_id", nullable = false)
  open var question: QuestionEntity? = null

  @Column(name = "text", nullable = false, columnDefinition = "TEXT") open var text: String? = null

  @Column(name = "format_and_code", nullable = false, columnDefinition = "TEXT")
  open var formatAndCode: String? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinTable(
    name = "question_metadata_correct_answers",
    joinColumns = [JoinColumn(name = "question_metadata_id")],
    inverseJoinColumns = [JoinColumn(name = "answer_id")],
  )
  open var correctAnswers: MutableList<AnswerEntity> = mutableListOf()

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinTable(
    name = "question_metadata_incorrect_answers",
    joinColumns = [JoinColumn(name = "question_metadata_id")],
    inverseJoinColumns = [JoinColumn(name = "answer_id")],
  )
  open var incorrectAnswers: MutableList<AnswerEntity> = mutableListOf()

  fun id(): UUID = nonNull(id)

  fun testMetadata(): TestMetadataEntity = nonNull(testMetadata)

  fun question(): QuestionEntity = nonNull(question)

  fun text(): String = nonNull(text)

  fun formatAndCode(): String = nonNull(formatAndCode)

  fun correctAnswers(): MutableList<AnswerEntity> = correctAnswers

  fun incorrectAnswers(): MutableList<AnswerEntity> = incorrectAnswers

  fun answers(): List<AnswerEntity> = correctAnswers + incorrectAnswers
}
