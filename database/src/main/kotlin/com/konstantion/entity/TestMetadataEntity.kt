package com.konstantion.entity

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

  @ManyToOne
  @JoinColumn(name = "test_model_id", nullable = false)
  open var immutableTestEntity: ImmutableTestEntity? = null

  @Column(name = "name", nullable = false) open var name: String? = null

  @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
  @JoinColumn(name = "test_metadata_id", nullable = false)
  open var questionMetadata: MutableList<QuestionMetadataEntity> = mutableListOf()
}
