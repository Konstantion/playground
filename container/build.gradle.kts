plugins {
    alias(libs.plugins.common)
}

dependencies {
    implementation(project(":std"))
    implementation(libs.slf4j)
    runtimeOnly(libs.logback.classic)
    implementation(libs.docker.java)
}
