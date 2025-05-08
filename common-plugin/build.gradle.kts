plugins {
    kotlin("jvm") version "2.0.20-RC"
    `java-gradle-plugin`
}

group = "com.konstantion"
version = "1.0-SNAPSHOT"

kotlin {
    jvmToolchain(21)
}

repositories {
    gradlePluginPortal()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-gradle-plugin:3.2.2")
    implementation("io.spring.gradle:dependency-management-plugin:1.1.4")
    implementation("org.jetbrains.kotlin.plugin.spring:org.jetbrains.kotlin.plugin.spring.gradle.plugin:2.0.20-RC")
    implementation("com.diffplug.spotless:spotless-plugin-gradle:6.25.0")
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.20-RC")
}

gradlePlugin {
    plugins {
        create("CommonPlugin") {
            id = "$group.common"
            implementationClass = "$group.$name"
        }

        create("SpringPlugin") {
            id = "$group.common.spring"
            implementationClass = "$group.$name"
        }
    }
}
