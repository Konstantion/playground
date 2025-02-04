plugins {
    `java-library`
    alias(libs.plugins.common.spring)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    implementation(project(":core"))
    api("org.jetbrains.kotlin:kotlin-reflect")
    api("org.springframework.boot:spring-boot-starter-jdbc")
    api("org.springframework.boot:spring-boot-starter-data-jpa")
    api(libs.postgresql)
    api(libs.postgresql)
    api(libs.hikariCp)
}