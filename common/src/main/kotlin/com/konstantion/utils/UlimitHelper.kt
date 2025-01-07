package com.konstantion.utils

object UlimitHelper {
  sealed interface ExitCode {

    data object SigKill : ExitCode
    data object SigSegv : ExitCode
    data object SigCpu : ExitCode
    data class Unknown(val rawCode: Int) : ExitCode

    companion object {
      fun parse(rawCode: Int): ExitCode {
        return when (rawCode) {
          137 -> SigKill
          139 -> SigSegv
          152 -> SigCpu
          else -> Unknown(rawCode)
        }
      }
    }
  }
}
