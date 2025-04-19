plugins {
    `java-library`
    alias(libs.plugins.common.spring)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    api(project(":internal"))
    api(project(":sandbox"))
    api(project(":database"))
    implementation(libs.slf4j)
    implementation(libs.jwt)
    runtimeOnly(libs.logback.classic)
    api(libs.kotlinx.serialization.core)
    api(libs.kotlinx.serialization.json)
}
