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

@Component
@EnableScheduling
class FlockSimulator(@Autowired private val messagingTemplate: SimpMessagingTemplate) {
    private var amount = 2000
    private var flock: List<Boid> = List(amount) { Boid(Vector.random(), Vector(0.0,0.0)) }

    var cohRange: Double = 5.5
    var aliRange: Double = 7.2
    var sepRange: Double = 7.1

    var cohScale: Double = 0.5
    var aliScale: Double = 1.3
    var sepScale: Double = 2.8

    private val spatialGrid = SpatialGrid(cellSize = 50.0, width = 600.0, height = 600.0)

    @Scheduled(fixedRate = 30)
    fun broadcastFlockPositions() {
        spatialGrid.clear()
        flock.forEach { spatialGrid.addBoid(it) }

        val avgPosition = flock.fold(Vector(0.0, 0.0)) { acc, boid ->
            acc.add(boid.position)
        }.divide(flock.size.toDouble())

        runBlocking {
            calculateUpdatesAsync(boids = flock, avgPosition)
        }

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

    fun reset(newAmount: Int = amount) {
        amount = newAmount
        flock = List(amount) { Boid(Vector.random(), Vector(0.0, 0.0)) }
    }
}
