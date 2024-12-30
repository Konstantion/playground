plugins {
    `java-library`
    alias(libs.plugins.common)
}


dependencies {
    implementation(project(":common"))
    implementation(project(":internal"))
    implementation(libs.slf4j)
    runtimeOnly(libs.log4j.slf4j2.impl)
}
