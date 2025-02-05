package com.konstantion.service

data class SqlError(val message: String) : QuestionService.Issue

data class Forbidden(val message: String) : QuestionService.Issue
