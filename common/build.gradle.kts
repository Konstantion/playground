plugins {
    `java-library`
    alias(libs.plugins.common)
}


dependencies {
    api(project(":std"))
    implementation(libs.slf4j)
}
