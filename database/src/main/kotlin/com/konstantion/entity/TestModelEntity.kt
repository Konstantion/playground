package com.konstantion.entity

import com.konstantion.model.TestModel
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
import java.time.LocalDateTime
import java.util.UUID
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "test_models")
open class TestModelEntity {
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

  fun id(): UUID = nonNull(id)

  fun name(): String = nonNull(name)

  fun questions(): MutableList<QuestionEntity> = questions

  fun active(): Boolean = active

  fun createdAt(): LocalDateTime = createdAt

  fun toModel(): TestModel {
    return TestModel(id = id(), name = name(), questions = questions.map(QuestionEntity::toModel))
  }

  companion object {
    fun fromModel(testModel: TestModel): TestModelEntity {
      val entity = TestModelEntity()
      entity.id = testModel.id
      entity.name = testModel.name
      entity.questions = testModel.questions.map(QuestionEntity::fromModel).toMutableList()
      return entity
    }
  }
}
