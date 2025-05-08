package com.konstantion.entity

import com.konstantion.utils.FieldUtils
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "user_question_answer")
open class UserQuestionAnswerEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @ManyToOne(optional = false)
  @JoinColumn(name = "question_metadata_id", nullable = false)
  open var question: QuestionMetadataEntity? = null

  @ManyToMany
  @JoinTable(
    name = "user_question_answer_mapping",
    joinColumns = [JoinColumn(name = "user_question_answer_id")],
    inverseJoinColumns = [JoinColumn(name = "answer_id", nullable = false)],
  )
  open var answers: MutableList<AnswerEntity> = mutableListOf()

  fun id(): UUID = FieldUtils.nonNull(id)

  fun question(): QuestionMetadataEntity = FieldUtils.nonNull(question)

  fun answers(): List<AnswerEntity> = FieldUtils.nonNull(answers)
}
