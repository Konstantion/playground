package com.konstantion.utils

fun <T> T?.nonNull(): T = this ?: error("shouldn't be null")
