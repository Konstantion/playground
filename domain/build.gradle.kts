plugins {
    `java-library`
    alias(libs.plugins.common)
}


dependencies {
    implementation(project(":std"))
}
