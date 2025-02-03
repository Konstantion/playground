package com.konstantion.entity

import com.konstantion.model.Code
import com.konstantion.model.Lang
import com.konstantion.model.serializaers.OutputTypeSerializer
import com.konstantion.utils.FieldUtils.nonNull
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID
import kotlinx.serialization.json.Json

@Entity
@Table(name = "codes")
open class CodeEntity {

  @Id @GeneratedValue(strategy = GenerationType.UUID) open var id: UUID? = null

  @Column(name = "code", nullable = false) open var code: String? = null

  @Column(name = "output_type", nullable = false) open var outputType: String? = null

  fun <L> toModel(lang: L): Code<L, *> where L : Lang {
    return Code(
      nonNull(code),
      lang,
      Json.decodeFromString(OutputTypeSerializer, nonNull(outputType))
    )
  }
}
