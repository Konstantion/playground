package com.konstantion.beans

import com.konstantion.executor.QuestionExecutor
import com.konstantion.executor.TestModelExecutor
import com.konstantion.model.Lang
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class TestExecutorBean {
  @Bean(destroyMethod = "close")
  fun testExecutor(questionExecutor: QuestionExecutor<Lang.Python>): TestModelExecutor {
    val questionExecutors: MutableMap<Lang, QuestionExecutor<Lang>> = mutableMapOf()
    questionExecutors[Lang.Python] = questionExecutor as QuestionExecutor<Lang>
    return TestModelExecutor(
      questionExecutors = questionExecutors,
    )
  }
}
