package com.konstantion.entity

import com.konstantion.model.TestModel
import com.konstantion.utils.FieldUtils.nonNull
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "test_models")
open class TestModelEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @Column(name = "name", nullable = false) open var name: String? = null

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
    name = "test_models_questions",
    joinColumns = [JoinColumn(name = "test_model_id")],
    inverseJoinColumns = [JoinColumn(name = "question_id")],
  )
  @OnDelete(action = OnDeleteAction.CASCADE)
  open var questions: MutableList<QuestionEntity> = mutableListOf()

  @Column(name = "created_at", nullable = false) open var createdAt: Instant = Instant.now()

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "creator_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  open var creator: UserEntity? = null

  fun id(): UUID = nonNull(id)

  fun name(): String = nonNull(name)

  fun questions(): MutableList<QuestionEntity> = questions

  fun createdAt(): Instant = createdAt

  fun toModel(): TestModel =
    TestModel(id = id(), name = name(), questions = questions.map(QuestionEntity::toModel))

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
