package com.konstantion.service

import com.konstantion.entity.CodeEntity
import com.konstantion.entity.UserEntity
import com.konstantion.entity.VariantEntity
import com.konstantion.model.Code
import com.konstantion.model.Role
import com.konstantion.model.serializaers.OutputTypeSerializer
import com.konstantion.repository.CodeRepository
import com.konstantion.repository.VariantRepository
import com.konstantion.service.SqlHelper.sqlAction
import com.konstantion.service.SqlHelper.sqlOptionalAction
import com.konstantion.utils.Either
import java.time.LocalDateTime
import java.util.UUID
import kotlinx.serialization.json.Json
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
data class VariantService(
  private val variantRepository: VariantRepository,
  private val codeRepository: CodeRepository,
) {
  private val log: Logger = LoggerFactory.getLogger(javaClass)

  fun getById(id: UUID): Either<ServiceIssue, VariantEntity> {
    log.info("Finding variant by ID: {}", id)
    return when (
      val result: Either<ServiceIssue, VariantEntity> =
        variantRepository.sqlOptionalAction { findById(id) }
    ) {
      is Either.Left -> result
      is Either.Right -> {
        log.info("Variant found: {}", result.value)
        Either.right(result.value)
      }
    }
  }

  fun create(creator: UserEntity, createParams: CreateParams): Either<ServiceIssue, VariantEntity> {
    log.info("Creating variant for user: {} with code: {}", creator, createParams)
    return when (creator.role()) {
      Role.Admin,
      Role.Teacher -> {
        val codeToSave =
          CodeEntity().apply {
            code = createParams.code
            outputType = Json.encodeToString(OutputTypeSerializer, Code.Output.Str::class.java)
          }

        val createdCode: CodeEntity =
          when (
            val result: Either<ServiceIssue, CodeEntity> =
              codeRepository.sqlAction { saveAndFlush(codeToSave) }
          ) {
            is Either.Left -> return Either.left(result.value)
            is Either.Right -> result.value
          }

        val variantToSave: VariantEntity =
          VariantEntity().apply {
            code = createdCode
            createdAt = LocalDateTime.now()
            createdBy = creator
          }

        val savedVariant =
          when (
            val result: Either<ServiceIssue, VariantEntity> =
              variantRepository.sqlAction { saveAndFlush(variantToSave) }
          ) {
            is Either.Left -> return Either.left(result.value)
            is Either.Right -> result.value
          }

        log.info("Variant created successfully: {}", savedVariant)

        Either.right(savedVariant)
      }
      Role.Student -> Forbidden.asEither("You are not allowed to create a variant")
    }
  }

  fun update(user: UserEntity, updateParams: UpdateParams): Either<ServiceIssue, VariantEntity> {
    log.info("Updating variant for user: {} with params: {}", user, updateParams)
    return when (user.role()) {
      Role.Admin,
      Role.Teacher -> {
        val variantDb: VariantEntity =
          when (
            val result: Either<ServiceIssue, VariantEntity> =
              variantRepository.sqlOptionalAction { findById(updateParams.id) }
          ) {
            is Either.Left -> return Either.left(result.value)
            is Either.Right -> result.value
          }

        val dbCode = variantDb.code()
        dbCode.code = updateParams.code

        val savedCode: CodeEntity =
          when (
            val result: Either<ServiceIssue, CodeEntity> =
              codeRepository.sqlAction { saveAndFlush(dbCode) }
          ) {
            is Either.Left -> return Either.left(result.value)
            is Either.Right -> result.value
          }

        val updatedVariant =
          when (
            val result: Either<ServiceIssue, VariantEntity> =
              variantRepository.sqlAction { saveAndFlush(variantDb) }
          ) {
            is Either.Left -> return Either.left(result.value)
            is Either.Right -> result.value
          }

        log.info("Variant updated successfully: {}", updatedVariant)

        Either.right(updatedVariant)
      }
      Role.Student -> Forbidden.asEither("You are not allowed to update a variant")
    }
  }

  data class CreateParams(val code: String)

  data class UpdateParams(val id: UUID, val code: String)
}
