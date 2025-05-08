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
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "test_metadata")
open class TestMetadataEntity {
  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "immutable_test_id", nullable = false) // Renamed for clarity
  open var immutableTestEntity: ImmutableTestEntity? = null

  @Column(name = "name", nullable = false) open var name: String? = null

  @OneToMany(
    mappedBy = "testMetadata",
    cascade = [CascadeType.ALL],
    fetch = FetchType.LAZY,
    orphanRemoval = true,
  )
  open var questionMetadata: MutableList<QuestionMetadataEntity> = mutableListOf()

  fun id(): UUID = FieldUtils.nonNull(id)

  fun immutableTestEntity(): ImmutableTestEntity = FieldUtils.nonNull(immutableTestEntity)

  fun name(): String = FieldUtils.nonNull(name)

  fun questionMetadata(): List<QuestionMetadataEntity> = FieldUtils.nonNull(questionMetadata)
}
