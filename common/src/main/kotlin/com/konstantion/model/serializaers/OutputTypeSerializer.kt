package com.konstantion.model.serializaers

import com.konstantion.lang.Unreachable
import com.konstantion.model.Code
import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

object OutputTypeSerializer : KSerializer<Class<out Code.Output>> {
  override val descriptor: SerialDescriptor =
    PrimitiveSerialDescriptor("OutputType", PrimitiveKind.STRING)

  override fun serialize(
    encoder: Encoder,
    value: Class<out Code.Output>,
  ) {
    when {
      value.isAssignableFrom(Code.Output.Str::class.java) -> encoder.encodeString("Str")
      value.isAssignableFrom(Code.Output.Bool::class.java) -> encoder.encodeString("Bool")
      else -> throw Unreachable("unhandled serialize $value")
    }
  }

  override fun deserialize(decoder: Decoder): Class<out Code.Output> {
    val cls =
      when (val str = decoder.decodeString()) {
        "Str" -> Code.Output.Str::class.java
        "Bool" -> Code.Output.Bool::class.java
        else -> throw Unreachable("unhandled deserialize $str")
      }
    return cls
  }
}
