package com.konstantion.beans

import com.konstantion.executor.NaiveQuestionExecutor
import com.konstantion.executor.QuestionExecutor
import com.konstantion.interpreter.PythonCodeInterpreter
import com.konstantion.model.Lang
import com.konstantion.sandbox.GroupId
import com.konstantion.sandbox.UserBasedSandbox
import com.konstantion.utils.CmdHelper
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class QuestionExecutorBean {
  @Bean
  fun pythonExecutor(): QuestionExecutor<Lang.Python> {
    return NaiveQuestionExecutor(pythonSandbox(), GroupId(0L))
  }

  private fun pythonSandbox(): UserBasedSandbox<Lang.Python> {
    return UserBasedSandbox(
      LoggerFactory::getLogger,
      Lang.Python,
      "kostia",
      CmdHelper.Python3File,
      PythonCodeInterpreter
    )
  }
}
