package com.konstantion.dto.serializers

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider

class ListRawSerializer : JsonSerializer<List<String>>() {
  override fun serialize(
    value: List<String>?,
    gen: JsonGenerator,
    serializers: SerializerProvider
  ) {
    if (value == null) {
      gen.writeNull()
    } else {
      gen.writeStartArray()
      value.forEach(gen::writeRawValue)
      gen.writeEndArray()
    }
  }
}
