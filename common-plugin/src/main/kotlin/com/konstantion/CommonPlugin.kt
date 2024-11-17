package com.konstantion

import com.diffplug.gradle.spotless.SpotlessExtension
import com.diffplug.gradle.spotless.SpotlessPlugin
import com.diffplug.spotless.LineEnding
import org.gradle.api.JavaVersion
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.api.plugins.JavaPlugin
import org.gradle.api.plugins.JavaPluginExtension
import org.gradle.api.tasks.compile.JavaCompile
import org.gradle.api.tasks.testing.Test
import org.gradle.plugins.ide.eclipse.EclipsePlugin
import org.gradle.plugins.ide.idea.IdeaPlugin
import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension

class CommonPlugin : Plugin<Project> {
    override fun apply(target: Project): Unit = with(target) {
        listOf(
            JavaPlugin::class,
            IdeaPlugin::class,
            EclipsePlugin::class,
            SpotlessPlugin::class,
        ).forEach { plugins.apply(it.java) }

        plugins.apply("org.jetbrains.kotlin.jvm")

        tasks.named("compileJava", JavaCompile::class.java).get().options.encoding = "UTF-8"
        tasks.named("compileTestJava", JavaCompile::class.java).get().options.encoding = "UTF-8"

        extensions.getByType(JavaPluginExtension::class.java).apply {
            sourceCompatibility = JavaVersion.VERSION_21
            targetCompatibility = JavaVersion.VERSION_21
        }

        extensions.getByType(KotlinJvmProjectExtension::class.java).apply {
            jvmToolchain(21)
        }

        with(extensions.getByType(SpotlessExtension::class.java)) {
            java { ext ->
                ext.googleJavaFormat()
            }
            kotlin { ext ->
                ext.lineEndings = LineEnding.PLATFORM_NATIVE
                ext.ktfmt()
            }
        }


        group = "com.konstantion"

        repositories.mavenCentral()

        dependencies.add("testImplementation", "org.junit.jupiter:junit-jupiter-api:5.7.0")
        dependencies.add("testRuntimeOnly", "org.junit.jupiter:junit-jupiter-engine:5.7.0")
        tasks.named("test", Test::class.java, Test::useJUnitPlatform)
    }
}