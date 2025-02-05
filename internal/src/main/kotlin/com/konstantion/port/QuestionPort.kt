package com.konstantion.port

interface QuestionPort<Entry> where Entry : Any {
  fun save(entry: Entry): Entry
  fun findAll(): List<Entry>
}
