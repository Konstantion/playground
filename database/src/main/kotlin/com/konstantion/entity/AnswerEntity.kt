package com.konstantion.entity

import com.konstantion.utils.FieldUtils.nonNull
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "answer")
open class AnswerEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @ManyToOne
  @JoinColumn(name = "question_id", nullable = false)
  open var question: QuestionEntity? = null

  @Column(name = "answer", nullable = false) open var answer: String? = null

  @Column(name = "task_id", nullable = false) open var taskId: Long? = null

  fun id(): UUID = nonNull(id)

  fun question(): QuestionEntity = nonNull(question)

  fun answer(): String = nonNull(answer)
}
