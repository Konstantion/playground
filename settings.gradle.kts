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
include("database")

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

            run {
                val version = "1.4.14"
                val prefix = "ch.qos.logback"
                library("logback-classic", "$prefix:logback-classic:$version")
            }

            run {
                val version = "0.11.2"
                val group = "io.jsonwebtoken"
                library("jwt-api", "$group:jjwt-api:$version")
                library("jwt-jackson", "$group:jjwt-jackson:$version")
                library("jwt-impl", "$group:jjwt-impl:$version")

                bundle("jwt", listOf("jwt-api", "jwt-jackson", "jwt-impl"))
            }

            library("apache-commons-lang3", "org.apache.commons:commons-lang3:3.12.0")
            library("postgresql", "org.postgresql:postgresql:42.5.0")
            library("hikariCp", "com.zaxxer:HikariCP:5.0.1")
            library("flyway", "org.flywaydb:flyway-core:9.15.1")
            library("swagger", "org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2")
            library("swagger-api", "org.springdoc:springdoc-openapi-starter-webmvc-api:2.0.2")
            library("swagger-common", "org.springdoc:springdoc-openapi-starter-common:2.0.2")
            library("kotlin-reflect", "org.jetbrains.kotlin:kotlin-reflect:2.0.20-RC")
            library("jackson-module-kotlin", "com.fasterxml.jackson.module:jackson-module-kotlin:2.15.2")
        }
    }
}
