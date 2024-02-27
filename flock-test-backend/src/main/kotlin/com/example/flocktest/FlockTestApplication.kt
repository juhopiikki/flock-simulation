package com.example.flocktest

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class FlockTestApplication

fun main(args: Array<String>) {
	runApplication<FlockTestApplication>(*args)
}
