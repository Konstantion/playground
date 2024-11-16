@file:Suppress("UnstableApiUsage")

rootProject.name = "playground"

includeBuild("common-plugin")
include("container")

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            plugin("common", "com.konstantion.common").version("1.0-SNAPSHOT")
            plugin("kotlin", "org.jetbrains.kotlin.jvm").version("2.0.20-RC")

            library("docker-java", "com.github.docker-java:docker-java:3.4.0")
        }
    }
}
