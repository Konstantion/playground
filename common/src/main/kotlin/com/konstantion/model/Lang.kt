package com.konstantion.model

sealed interface Lang {
  data object JavaScript : Lang

  data object Python : Lang
}
