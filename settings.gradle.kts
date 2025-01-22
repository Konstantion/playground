@file:Suppress("UnstableApiUsage")

rootProject.name = "playground"

includeBuild("common-plugin")
include("container")
include("std")
include("web-app")
include("common")
include("internal")
include("sandbox")
include("core")

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            plugin("shadow", "com.github.johnrengelman.shadow").version("7.1.2")
            plugin("common", "com.konstantion.common").version("1.0-SNAPSHOT")
            plugin("common-spring", "com.konstantion.common.spring").version("1.0-SNAPSHOT")
            plugin("kotlin", "org.jetbrains.kotlin.jvm").version("2.0.20-RC")
            plugin("kotlin-serialization", "org.jetbrains.kotlin.plugin.serialization").version("2.0.20-RC")


            library("docker-java", "com.github.docker-java:docker-java:3.4.0")
            library("slf4j", "org.slf4j:slf4j-api:2.0.7")

            run {
                val version = "1.6.3"
                val prefix = "org.jetbrains.kotlinx"
                library("kotlinx-serialization-json", "$prefix:kotlinx-serialization-json:$version")
                library("kotlinx-serialization-core", "$prefix:kotlinx-serialization-core:$version")
                library("kotlinx-serialization-cbor", "$prefix:kotlinx-serialization-cbor:$version")

                bundle("kotlinx-serialization", listOf("json", "core", "cbor").map { "kotlinx-serialization-$it" })
            }


            run {
                val version = "2.20.0"
                val prefix = "org.apache.logging.log4j"
                library("log4j-core", "$prefix:log4j-core:$version")
                library("log4j-slf4j2-impl", "$prefix:log4j-slf4j2-impl:$version")
            }
        }
    }
}
