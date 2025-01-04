package com.konstantion

import com.konstantion.utils.Either
import org.slf4j.Logger
import org.slf4j.LoggerFactory

fun main() {
  val log: Logger = LoggerFactory.getLogger("main")
  log.info(Either.left<String, String>("forsen").toString())
}
