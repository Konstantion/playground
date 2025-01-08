package com.konstantion.storage

import com.konstantion.model.Lang
import com.konstantion.utils.Either
import java.io.IOException
import java.nio.charset.Charset
import java.nio.file.Path
import java.nio.file.StandardOpenOption
import kotlin.io.path.createDirectories
import kotlin.io.path.deleteExisting
import kotlin.io.path.exists
import kotlin.io.path.isDirectory
import kotlin.io.path.notExists
import kotlin.io.path.writeText

private val BASE_PATH = Path.of("temp", "files")

enum class FileType(val type: String) {
  PY("py");

  companion object {
    fun of(lang: Lang): FileType {
      return when (lang) {
        Lang.JavaScript -> TODO()
        Lang.Python -> PY
      }
    }
  }
}

class TempFileStorage<Id>(dirName: String) where Id : Any {
  private val storagePath =
    BASE_PATH.resolve(dirName).also { path ->
      if (path.exists()) {
        if (!path.isDirectory()) {
          path.deleteExisting()
          path.createDirectories()
        }
      } else {
        path.createDirectories()
      }
    }

  fun save(id: Id, content: String, type: FileType): Either<IOException, Path> {
    try {
      val filePath = storagePath.resolve("$id.${type.type}")
      filePath.writeText(
        content,
        Charset.defaultCharset(),
        StandardOpenOption.CREATE,
        StandardOpenOption.TRUNCATE_EXISTING
      )
      return Either.right(filePath.toAbsolutePath())
    } catch (ioError: IOException) {
      return Either.left(ioError)
    }
  }

  fun resolve(id: Id, type: FileType): Either<IOException, Path> {
    try {
      val filePath = storagePath.resolve("$id.${type.type}")
      if (filePath.notExists()) {
        return Either.left(IOException("File $filePath doesn't exist."))
      }
      return Either.right(filePath.toAbsolutePath())
    } catch (ioError: IOException) {
      return Either.left(ioError)
    }
  }

  fun delete(id: Id, type: FileType): Either<IOException, Path> {
    try {
      val filePath = storagePath.resolve("$id.${type.type}")
      if (filePath.notExists()) {
        return Either.left(IOException("File $filePath doesn't exist."))
      }
      filePath.deleteExisting()
      return Either.right(filePath.toAbsolutePath())
    } catch (ioError: IOException) {
      return Either.left(ioError)
    }
  }

  override fun toString(): String = "TempFileStorage[storagePath=${storagePath.toAbsolutePath()}]"
}
