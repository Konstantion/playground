plugins {
    alias(libs.plugins.common)
}

dependencies {
    implementation(project(":std"))
    implementation(libs.slf4j)
    runtimeOnly(libs.log4j.slf4j2.impl)
    implementation(libs.docker.java)
}