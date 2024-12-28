@file:Suppress("UnstableApiUsage")

rootProject.name = "playground"

includeBuild("common-plugin")
include("container")
include("std")
include("web-app")
include("domain")

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            plugin("common", "com.konstantion.common").version("1.0-SNAPSHOT")
            plugin("common-spring", "com.konstantion.common.spring").version("1.0-SNAPSHOT")
            plugin("kotlin", "org.jetbrains.kotlin.jvm").version("2.0.20-RC")

            library("docker-java", "com.github.docker-java:docker-java:3.4.0")
            library("slf4j", "org.slf4j:slf4j-api:2.0.7")

            run {
                val version = "2.20.0"
                val prefix = "org.apache.logging.log4j"
                library("log4j-core", "$prefix:log4j-core:$version")
                library("log4j-slf4j2-impl", "$prefix:log4j-slf4j2-impl:$version")
            }
        }
    }
}
