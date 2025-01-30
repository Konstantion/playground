plugins {
    `java-library`
    alias(libs.plugins.common)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    api(project(":internal"))
    api(project(":sandbox"))
    implementation(libs.slf4j)
    runtimeOnly(libs.logback.classic)
    api(libs.kotlinx.serialization.core)
    api(libs.kotlinx.serialization.json)
}
