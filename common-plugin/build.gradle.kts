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
    implementation("com.diffplug.spotless:spotless-plugin-gradle:6.25.0")
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.20-RC")
}

gradlePlugin.plugins.create("CommonPlugin") {
    id = "$group.common"
    implementationClass = "$group.$name"
}


