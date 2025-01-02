package com.konstantion.utils

import com.konstantion.model.Lang

sealed interface CmdHelper<L> where L : Lang {
  fun create(rawCode: String): String

  data object Python : CmdHelper<Lang.Python> {
    override fun create(rawCode: String): String {
      require(rawCode.isNotBlank()) { "Raw code shouldn't be blank." }
      return "python -c $rawCode"
    }
  }
}
