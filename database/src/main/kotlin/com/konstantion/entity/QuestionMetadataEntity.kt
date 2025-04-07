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
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "question_metadata")
open class QuestionMetadataEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @ManyToOne
  @JoinColumn(name = "question_id", nullable = false)
  open var question: QuestionEntity? = null

  @Column(name = "text", nullable = false) open var text: String? = null

  @Column(name = "format_and_code", nullable = false) open var formatAndCode: String? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinColumn(name = "correct_answer_id", nullable = false)
  open var correctAnswers: MutableList<AnswerEntity> = mutableListOf()

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinColumn(name = "incorrect_answer_id", nullable = false)
  open var incorrectAnswers: MutableList<AnswerEntity> = mutableListOf()

  fun id(): UUID = nonNull(id)
  fun text(): String = nonNull(text)
  fun formatAndCode(): String = nonNull(formatAndCode)
  fun correctAnswers(): MutableList<AnswerEntity> = correctAnswers
  fun incorrectAnswers(): MutableList<AnswerEntity> = incorrectAnswers
  fun answers(): List<AnswerEntity> = correctAnswers + incorrectAnswers
}
