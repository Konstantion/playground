package com.konstantion

import org.slf4j.Logger

interface Logs {
  fun <S> forService(clazz: Class<S>): Logger where S : Any
}
