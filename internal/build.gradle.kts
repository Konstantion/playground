plugins {
    `java-library`
    alias(libs.plugins.common)
    alias(libs.plugins.kotlin.serialization)
}


dependencies {
    implementation(project(":common"))
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.kotlinx.serialization.json)
}
