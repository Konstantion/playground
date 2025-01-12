plugins {
    `java-library`
    alias(libs.plugins.shadow)
    alias(libs.plugins.common)
}

dependencies {
    implementation(project(":common"))
    implementation(project(":internal"))
    implementation(libs.slf4j)
    runtimeOnly(libs.log4j.slf4j2.impl)
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
