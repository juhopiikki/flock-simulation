package com.example.flocktest.components

import com.example.flocktest.Boid
import com.example.flocktest.Vector
import kotlinx.coroutines.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.Date
import kotlin.system.measureTimeMillis

@Component
@EnableScheduling
class FlockSimulator(@Autowired private val messagingTemplate: SimpMessagingTemplate) {
    private val amount = 2000
    private val flock: List<Boid> = List(amount) { Boid(Vector.random(), Vector.random()) }
    var sepScale: Double = 2.5 // 10 * Math.random()
    var aliScale: Double = 1.5 // 10 * Math.random()
    var cohScale: Double = 1.0 // 10 * Math.random()
    var sepRange: Double = 5.0 // 10 * Math.random()
    var aliRange: Double = 8.0 // 10 * Math.random()
    var cohRange: Double = 3.0 // 10 * Math.random()

    @Scheduled(fixedRate = 40)
    fun broadcastFlockPositions() {
        // val positions = flock.map { mapOf("x" to it.position.x, "y" to it.position.y) }
        val avgPosition = flock.fold(Vector(0.0, 0.0)) { acc, boid ->
            acc.add(boid.position)
        }.divide(flock.size.toDouble())

        val executionTime = measureTimeMillis {
            runBlocking {
                calculateUpdatesAsync(boids = flock, avgPosition)
            }
        }
        println("Calculation took $executionTime ms")

        // flock.forEach { it.applyBehaviors(flock, avgPosition, sepScale, aliScale, cohScale, aliRange, cohRange, sepRange) }

        val avgPosition2 = flock.fold(Vector(0.0, 0.0)) { acc, boid ->
            acc.add(boid.position)
        }.divide(flock.size.toDouble())
        val payload = mapOf(
                "boids" to flock.map { mapOf("x" to it.position.x, "y" to it.position.y) },
                "averagePosition" to mapOf("x" to avgPosition2.x, "y" to avgPosition2.y)
        )

        // println("Sending positions: ${positions.size}")
        messagingTemplate.convertAndSend("/topic/position", payload)
    }

    suspend fun calculateUpdatesAsync(boids: List<Boid>, avgPosition: Vector) = coroutineScope {
        boids.map {
            launch(Dispatchers.Default) {
                it.applyBehaviors(boids, avgPosition, sepScale, aliScale, cohScale, aliRange, cohRange, sepRange)
            }
        }
    }

    fun reset() {
        flock.forEach { it.position = Vector.random() }
    }
}
