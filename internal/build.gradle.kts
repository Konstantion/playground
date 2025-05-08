plugins {
    `java-library`
    alias(libs.plugins.common)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    api(project(":common"))
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.kotlinx.serialization.json)
}
