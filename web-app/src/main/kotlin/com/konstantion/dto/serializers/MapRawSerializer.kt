package com.konstantion.dto.serializers

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider

class MapRawSerializer : JsonSerializer<Map<String, String>>() {

  override fun serialize(
    value: Map<String, String>?,
    gen: JsonGenerator,
    serializers: SerializerProvider
  ) {
    if (value == null) {
      gen.writeNull()
    } else {
      gen.writeStartObject()
      value.forEach { (key, value) ->
        gen.writeFieldName(key)
        gen.writeRawValue(value)
      }
      gen.writeEndObject()
    }
  }
}
