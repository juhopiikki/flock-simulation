package com.example.flocktest.components

import com.example.flocktest.Boid
import com.example.flocktest.SpatialGrid
import com.example.flocktest.Vector
import kotlinx.coroutines.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import kotlin.math.roundToInt
import kotlin.math.roundToLong
import kotlin.system.measureTimeMillis

@Component
@EnableScheduling
class FlockSimulator(@Autowired private val messagingTemplate: SimpMessagingTemplate) {
    private val amount = 2000
    private val flock: List<Boid> = List(amount) { Boid(Vector.random(), Vector(0.0,0.0)) }

    var cohRange: Double = 5.0 // 10 * Math.random()
    var aliRange: Double = 8.0 // 10 * Math.random()
    var sepRange: Double = 3.0 // 10 * Math.random()

    var cohScale: Double = 1.0 // 10 * Math.random()
    var aliScale: Double = 1.0 // 10 * Math.random()
    var sepScale: Double = 2.5 // 10 * Math.random()

    private val spatialGrid = SpatialGrid(cellSize = 50.0, width = 600.0, height = 600.0)

    @Scheduled(fixedRate = 25)
    fun broadcastFlockPositions() {
        spatialGrid.clear()
        flock.forEach { spatialGrid.addBoid(it) }

        val avgPosition = flock.fold(Vector(0.0, 0.0)) { acc, boid ->
            acc.add(boid.position)
        }.divide(flock.size.toDouble())

        val executionTime = measureTimeMillis {
            runBlocking {
                calculateUpdatesAsync(boids = flock, avgPosition)
            }
        }
        println("Calculation took $executionTime ms")

        val avgPosition2 = flock.fold(Vector(0.0, 0.0)) { acc, boid ->
            acc.add(boid.position)
        }.divide(flock.size.toDouble())
        val payload = mapOf(
                "boids" to flock.map {
                    mapOf(
                        "x" to (it.position.x * 10).roundToInt() / 10.0,
                        "y" to (it.position.y * 10).roundToInt() / 10.0,
                        "vx" to (it.velocity.x * 10).roundToInt() / 10.0,
                        "vy" to (it.velocity.y * 10).roundToInt() / 10.0,
                    )
                 },
                "averagePosition" to mapOf("x" to avgPosition2.x, "y" to avgPosition2.y)
        )

        // println("Sending positions: ${positions.size}")
        messagingTemplate.convertAndSend("/topic/position", payload)
    }

    suspend fun calculateUpdatesAsync(boids: List<Boid>, avgPosition: Vector) = coroutineScope {
        boids.map {
            launch(Dispatchers.Default) {
                val neighbors = spatialGrid.getNeighbors(it)
                it.applyBehaviors(neighbors, avgPosition, sepScale, aliScale, cohScale, aliRange, cohRange, sepRange)
            }
        }
    }

    fun reset() {
        flock.forEach { it.position = Vector.random() }
    }
}
