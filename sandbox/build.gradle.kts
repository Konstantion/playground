plugins {
    alias(libs.plugins.shadow)
    alias(libs.plugins.common)
}

dependencies {
    implementation(project(":internal"))
    implementation(libs.slf4j)
    runtimeOnly(libs.logback.classic)
}

tasks.jar {
    enabled = false
    dependsOn(tasks.shadowJar)
}

tasks.shadowJar {
    archiveFileName.set("sandbox.jar")
    manifest {
        attributes["Main-Class"] = "com.konstantion.MainKt"
    }
    mergeServiceFiles()
}
