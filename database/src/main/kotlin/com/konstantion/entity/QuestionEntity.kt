package com.konstantion.entity

import com.konstantion.model.PlaceholderIdentifier
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID


@Entity
@Table
class QuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id : UUID? = null

    val lang : String? = null

    val body : String? = null

    val formatAndCode : String? = null

    val placeholderDefinitions : Map<String, String>? = null

}