package com.konstantion.utils

import com.konstantion.model.Lang
import java.nio.file.Path
import kotlin.io.path.Path
import kotlin.io.path.exists
import org.apache.commons.lang3.SystemUtils
import org.slf4j.LoggerFactory

private val PYTHON_EXECUTABLE_NAME =
  if (SystemUtils.IS_OS_WINDOWS) {
    "python.exe"
  } else {
    "python3"
  }

private val LOG = LoggerFactory.getLogger("CmdHelper")

private val PYTHON_PATH = resolvePython().toAbsolutePath().normalize().toString()

private fun resolvePython(): Path {
  val cwd = Path(".").toAbsolutePath().normalize()
  val binDir = cwd.resolve("bin")
  val platformSubdir =
    if (SystemUtils.IS_OS_WINDOWS) {
      "windows"
    } else {
      "linux"
    }
  val localPython = binDir.resolve(platformSubdir).resolve(PYTHON_EXECUTABLE_NAME)

  if (localPython.exists()) {
    LOG.info("Python executable found at {}", localPython)
    return localPython
  }

  cwd.parent?.let { parent ->
    val parentPython = parent.resolve("bin").resolve(platformSubdir).resolve(PYTHON_EXECUTABLE_NAME)
    if (parentPython.exists()) {
      LOG.info("Python executable found at parent directory {}", parentPython)
      return parentPython
    }
  }

  if (!SystemUtils.IS_OS_WINDOWS) {
    val systemPython = Path("/usr/bin").resolve(PYTHON_EXECUTABLE_NAME)
    if (systemPython.exists()) {
      LOG.info("System Python found at {}", systemPython)
      return systemPython
    }
  }

  throw IllegalStateException(
    "Could not find Python. Searched:\n" +
      "- project local: $localPython\n" +
      (cwd.parent?.let {
        "- parent local: ${
                        it.resolve("bin").resolve(platformSubdir).resolve(PYTHON_EXECUTABLE_NAME)
                    }\n"
      }
        ?: "") +
      (if (!SystemUtils.IS_OS_WINDOWS) "- system: /usr/bin/$PYTHON_EXECUTABLE_NAME" else ""),
  )
}

sealed interface CmdHelper<L> where L : Lang {
  fun build(input: String): List<String>

  data object PythonInline : CmdHelper<Lang.Python> {
    override fun build(input: String): List<String> {
      require(input.isNotBlank()) { "Raw code shouldn't be blank." }
      return listOf(PYTHON_PATH, "-c", input)
    }
  }

  data object PythonFile : CmdHelper<Lang.Python> {
    override fun build(input: String): List<String> {
      require(input.isNotBlank()) { "Script path shouldn't be blank." }
      return listOf(PYTHON_PATH, input)
    }
  }
}
