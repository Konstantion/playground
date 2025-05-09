plugins {
    alias(libs.plugins.common.spring)
}

dependencies {
    implementation(project(":core"))
    implementation(project(":database"))
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation(libs.bundles.jwt)
    implementation(libs.swagger)
    implementation(libs.swagger.common)
    implementation(libs.swagger.api)
    implementation(libs.kotlin.reflect)
    implementation(libs.jackson.module.kotlin)
    implementation(libs.flyway.core)
    implementation(libs.flyway.postgres)
}

// exclude log4j-to-slf4j and log4j-slf4j2-impl
configurations.all {
    exclude(group = "org.apache.logging.log4j", module = "log4j-to-slf4j")
    exclude(group = "org.apache.logging.log4j", module = "log4j-slf4j2-impl")
}

tasks.jar {
    enabled = false
    dependsOn(tasks.bootJar)
}
