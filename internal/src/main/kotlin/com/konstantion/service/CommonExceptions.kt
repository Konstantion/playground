package com.konstantion.service

data class NotExistsException(override val message: String?) : RuntimeException(message)
