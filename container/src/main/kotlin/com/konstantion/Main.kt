package com.konstantion

import com.github.dockerjava.core.DockerClientBuilder


fun main() {
    val client = DockerClientBuilder.getInstance().build()
    println(client)
}