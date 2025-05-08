plugins {
    `java-library`
    alias(libs.plugins.common.spring)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    api(project(":internal"))
    api("org.jetbrains.kotlin:kotlin-reflect")
    api("org.springframework.boot:spring-boot-starter-jdbc")
    api("org.springframework.boot:spring-boot-starter-data-jpa")
    api(libs.postgresql)
    api(libs.postgresql)
    api(libs.hikariCp)
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.kotlinx.serialization.json)
}
