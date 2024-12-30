plugins {
    `java-library`
    alias(libs.plugins.common)
}


dependencies {
    implementation(project(":common"))
    implementation(project(":internal"))
}
