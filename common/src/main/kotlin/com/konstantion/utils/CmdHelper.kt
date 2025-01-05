package com.konstantion.utils

import com.konstantion.model.Lang

sealed interface CmdHelper<L> where L : Lang {
  fun create(rawCode: String): List<String>

  data object Python : CmdHelper<Lang.Python> {
    override fun create(rawCode: String): List<String> {
      require(rawCode.isNotBlank()) { "Raw code shouldn't be blank." }
      return listOf("python", "-c", rawCode)
    }
  }

  data object Python3 : CmdHelper<Lang.Python> {
    override fun create(rawCode: String): List<String> {
      require(rawCode.isNotBlank()) { "Raw code shouldn't be blank." }
      return listOf("python3", "-c", rawCode)
    }
  }
}
