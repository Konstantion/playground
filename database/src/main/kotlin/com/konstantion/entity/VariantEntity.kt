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
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "variants")
open class VariantEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @Column(name =  "identifier", updatable = false, nullable = false) open var identifier: UUID? = null

  @OneToOne(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinColumn(name = "code_id")
  open var code: CodeEntity? = null

  fun <L> toCorrect(lang: L): Question.Variant.Correct<L> where L : Lang {
    return Question.Variant.Correct(nonNull(identifier), refine(nonNull(code).toModel(lang)))
  }

  fun <L> toIncorrect(lang: L): Question.Variant.Incorrect<L> where L : Lang {
    return Question.Variant.Incorrect(nonNull(identifier), refine(nonNull(code).toModel(lang)))
  }

  override fun toString(): String {
    return "VariantEntity(id=$id, code=$code)"
  }

  companion object {
    fun fromCorrect(variant: Question.Variant.Correct<*>): VariantEntity {
      return VariantEntity().apply {
        id = null
        identifier = variant.identifier
        code = CodeEntity.fromModel(variant.code)
      }
    }

    fun fromIncorrect(variant: Question.Variant.Incorrect<*>): VariantEntity {
      return VariantEntity().apply {
        id = null
        identifier = variant.identifier
        code = CodeEntity.fromModel(variant.code)
      }
    }
  }
}
