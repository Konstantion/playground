package com.konstantion.model

interface Code<L, R> where L : Lang, R : Code.ReturnType {
  fun code(): String

  fun lang(): L

  fun returnType(): R

  sealed interface ReturnType {
    data object BOOL : ReturnType

    data object STR : ReturnType
  }
}
