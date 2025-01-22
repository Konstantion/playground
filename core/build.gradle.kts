plugins {
    `java-library`
    alias(libs.plugins.common)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    implementation(project(":common"))
    implementation(project(":internal"))
    implementation(project(":sandbox"))
    implementation(libs.slf4j)
    runtimeOnly(libs.log4j.slf4j2.impl)
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.kotlinx.serialization.json)
}
