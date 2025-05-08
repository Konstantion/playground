package com.konstantion.model.serializaers

import com.konstantion.lang.Unreachable
import com.konstantion.model.Lang
import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

object LangSerializer : KSerializer<Lang> {
  override val descriptor: SerialDescriptor =
    PrimitiveSerialDescriptor("Lang", PrimitiveKind.STRING)

  override fun deserialize(decoder: Decoder): Lang =
    when (val lang = decoder.decodeString()) {
      "javascript" -> Lang.JavaScript
      "python" -> Lang.Python
      else -> throw Unreachable("unhandled lang=$lang")
    }

  override fun serialize(
    encoder: Encoder,
    value: Lang,
  ) {
    encoder.encodeString(
      when (value) {
        Lang.JavaScript -> "javascript"
        Lang.Python -> "python"
      },
    )
  }
}
