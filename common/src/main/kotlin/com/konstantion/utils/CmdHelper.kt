package com.konstantion.utils

import com.konstantion.model.Lang

sealed interface CmdHelper<L> where L : Lang {
  fun build(input: String): List<String>

  data object Python : CmdHelper<Lang.Python> {
    override fun build(input: String): List<String> {
      require(input.isNotBlank()) { "Raw code shouldn't be blank." }
      return listOf("python", "-c", input)
    }
  }

  data object Python3 : CmdHelper<Lang.Python> {
    override fun build(input: String): List<String> {
      require(input.isNotBlank()) { "Raw code shouldn't be blank." }
      return listOf("/usr/bin/python3", "-c", input)
    }
  }

  data object Python3File : CmdHelper<Lang.Python> {
    override fun build(input: String): List<String> {
      require(input.isNotBlank()) { "Path shouldn't be blank." }
      return listOf("/usr/bin/python3", input)
    }
  }
}
