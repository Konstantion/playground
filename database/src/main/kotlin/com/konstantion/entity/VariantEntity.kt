package com.konstantion.entity

import com.konstantion.model.Lang
import com.konstantion.model.Question
import com.konstantion.utils.CastHelper.refine
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
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "variants")
open class VariantEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @OneToOne(cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
  @JoinColumn(name = "code_id")
  open var code: CodeEntity? = null

  @Column(name = "created_at", nullable = false) open var createdAt: Instant? = Instant.now()

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "created_by", nullable = true)
  open var createdBy: UserEntity? = null

  @Column(name = "public", nullable = false) open var public: Boolean = true

  fun <L> toCorrect(lang: L): Question.Variant.Correct<L> where L : Lang =
    Question.Variant.Correct(nonNull(id), refine(nonNull(code).toModel(lang)))

  fun <L> toIncorrect(lang: L): Question.Variant.Incorrect<L> where L : Lang =
    Question.Variant.Incorrect(nonNull(id), refine(nonNull(code).toModel(lang)))

  fun id(): UUID = nonNull(id)

  fun code(): CodeEntity = nonNull(code)

  fun createdAt(): Instant = nonNull(createdAt)

  fun public() = nonNull(public)

  override fun toString(): String = "VariantEntity(id=$id, code=$code)"

  companion object {
    fun fromCorrect(variant: Question.Variant.Correct<*>): VariantEntity =
      VariantEntity().apply {
        id = id()
        code = CodeEntity.fromModel(variant.code)
      }

    fun fromIncorrect(variant: Question.Variant.Incorrect<*>): VariantEntity =
      VariantEntity().apply {
        id = id()
        code = CodeEntity.fromModel(variant.code)
      }
  }
}
