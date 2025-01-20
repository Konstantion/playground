plugins {
    `java-library`
    alias(libs.plugins.common)
    alias(libs.plugins.kotlin.serialization)
}


dependencies {
    api(project(":std"))
    implementation(libs.slf4j)
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.kotlinx.serialization.json)
}
