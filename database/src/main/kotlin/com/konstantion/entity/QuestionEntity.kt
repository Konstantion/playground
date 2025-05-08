package com.konstantion.entity

import com.konstantion.model.Code
import com.konstantion.model.FormatAndCode
import com.konstantion.model.Lang
import com.konstantion.model.PlaceholderDefinition
import com.konstantion.model.PlaceholderIdentifier
import com.konstantion.model.PlaceholderLabel
import com.konstantion.model.PlaceholderValue
import com.konstantion.model.Question
import com.konstantion.utils.CastHelper.refine
import com.konstantion.utils.FieldUtils.nonNull
import jakarta.persistence.CascadeType
import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapKeyColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID
import kotlinx.serialization.json.Json
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "questions")
open class QuestionEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @Column(name = "lang", nullable = false) open var lang: String? = null

  @Column(name = "body", nullable = false) open var body: String? = null

  @Column(name = "format_and_code", nullable = false) open var formatAndCode: String? = null

  @ElementCollection
  @CollectionTable(
    name = "question_placeholder_definitions",
    joinColumns = [JoinColumn(name = "question_id")],
  )
  @MapKeyColumn(name = "placeholder_key")
  @Column(name = "placeholder_value")
  open var placeholderDefinitions: MutableMap<String, String> = mutableMapOf()

  @ElementCollection
  @CollectionTable(name = "question_call_args", joinColumns = [JoinColumn(name = "question_id")])
  @Column(name = "placeholder_label")
  open var callArgs: MutableList<String> = mutableListOf()

  @OneToOne(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinTable(
    name = "question_additional_check",
    joinColumns = [JoinColumn(name = "question_id")],
    inverseJoinColumns = [JoinColumn(name = "code_id")],
  )
  open var additionalCheck: CodeEntity? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinTable(
    name = "question_correct_variants",
    joinColumns = [JoinColumn(name = "question_id")],
    inverseJoinColumns = [JoinColumn(name = "variant_id")],
  )
  open var correctVariants: MutableList<VariantEntity> = mutableListOf()

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinTable(
    name = "question_incorrect_variants",
    joinColumns = [JoinColumn(name = "question_id")],
    inverseJoinColumns = [JoinColumn(name = "variant_id")],
  )
  open var incorrectVariants: MutableList<VariantEntity> = mutableListOf()

  @ManyToMany(mappedBy = "questions", fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.CASCADE)
  open var testModels: MutableList<TestModelEntity> = mutableListOf()

  @Column(name = "is_validated", nullable = false) open var validated: Boolean = false

  @Column(name = "is_public", nullable = false) open var public: Boolean = true

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(name = "creator_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  open var creator: UserEntity? = null

  @Column(name = "created_at", nullable = false) open var createdAt: Instant? = Instant.now()

  fun id(): UUID = nonNull(id)

  fun lang(): String = nonNull(lang)

  fun body(): String = nonNull(body)

  fun formatAndCode(): String = nonNull(formatAndCode)

  fun placeholderDefinitions(): Map<String, String> = placeholderDefinitions

  fun callArgs(): List<String> = callArgs

  fun additionalCheck(): CodeEntity? = additionalCheck

  fun correctVariants(): List<VariantEntity> = correctVariants

  fun incorrectVariants(): List<VariantEntity> = incorrectVariants

  fun validated(): Boolean = validated

  fun public(): Boolean = public

  fun creator(): UserEntity? = creator

  fun createdAt(): Instant = nonNull(createdAt)

  override fun toString(): String =
    "QuestionEntity(id=$id, lang=$lang, body=$body, formatAndCode=$formatAndCode, placeholderDefinitions=$placeholderDefinitions, callArgs=$callArgs, additionalCheck=$additionalCheck, correctVariants=$correctVariants, incorrectVariants=$incorrectVariants)"

  fun toModel(): Question<Lang> {
    val lang: Lang = Json.decodeFromString(nonNull(this.lang))
    val placeholderDefinition: Map<PlaceholderIdentifier, PlaceholderDefinition<PlaceholderValue>> =
      this.placeholderDefinitions
        .mapKeys { (identifier, _) -> PlaceholderIdentifier.valueOf(identifier) }
        .mapValues { (_, definition) -> Json.decodeFromString(definition) }
    val additionalCheck: Code<Lang, Code.Output.Bool>? =
      this.additionalCheck?.let { check -> refine(check.toModel(lang)) }
    val callArgs: List<PlaceholderLabel> =
      this.callArgs.map { label -> Json.decodeFromString(label) }
    val correctVariants: List<Question.Variant.Correct<Lang>> =
      this.correctVariants.map { variant -> variant.toCorrect(lang) }
    val incorrectVariants: List<Question.Variant.Incorrect<Lang>> =
      this.incorrectVariants.map { variant -> variant.toIncorrect(lang) }
    return Question(
      identifier = nonNull(id),
      lang = lang,
      body = nonNull(body),
      formatAndCode = Json.decodeFromString(nonNull(formatAndCode)),
      placeholderDefinitions = placeholderDefinition,
      callArgs = callArgs,
      additionalCheck = additionalCheck,
      correctVariants = correctVariants,
      incorrectVariants = incorrectVariants,
    )
  }

  companion object {
    fun fromModel(question: Question<*>): QuestionEntity {
      val entity = QuestionEntity()
      entity.id = question.identifier
      entity.lang = Json.encodeToString(Lang.serializer(), question.lang)
      entity.body = question.body
      entity.formatAndCode = Json.encodeToString(FormatAndCode.serializer(), question.formatAndCode)
      entity.placeholderDefinitions =
        question.placeholderDefinitions
          .mapKeys { (identifier, _) -> identifier.toString() }
          .mapValues { (_, definition) ->
            Json.encodeToString(
              PlaceholderDefinition.serializer(PlaceholderValue.serializer()),
              refine(definition),
            )
          }
          .toMutableMap()
      entity.callArgs =
        question.callArgs
          .map { callArg -> Json.encodeToString(PlaceholderLabel.serializer(), callArg) }
          .toMutableList()
      entity.additionalCheck = question.additionalCheck?.let(CodeEntity::fromModel)
      entity.correctVariants =
        question.correctVariants.map(VariantEntity::fromCorrect).toMutableList()
      entity.incorrectVariants =
        question.incorrectVariants.map(VariantEntity::fromIncorrect).toMutableList()
      return entity
    }
  }
}
