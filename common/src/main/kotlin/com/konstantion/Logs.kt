package com.konstantion

import org.slf4j.Logger

fun interface Logs {
  fun forService(clazz: Class<*>): Logger
}
