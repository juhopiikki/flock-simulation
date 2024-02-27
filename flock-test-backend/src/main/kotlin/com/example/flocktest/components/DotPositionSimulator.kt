package com.example.flocktest.components

import com.example.flocktest.controllers.SimulationController
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import kotlin.math.cos
import kotlin.math.sin
import kotlin.random.Random

//@Component
//@EnableScheduling
class DotPositionSimulator(@Autowired private val messagingTemplate: SimpMessagingTemplate) {

    private var angle = 0.0
    private val radius = 50 // Radius of the circle
    private val centerX = 50 // X coordinate of the circle's center
    private val centerY = 50 // Y coordinate of the circle's center

    //@Scheduled(fixedRate = 20)
    fun broadcastRandomPosition() {
        // Calculate the new position
        val x = radius * cos(angle) + centerX
        val y = radius * sin(angle) + centerY

        // Broadcast the position
        val position = mapOf("x" to x, "y" to y)
        messagingTemplate.convertAndSend("/topic/position", position)

        // Increment the angle for the next position
        angle += Math.PI / 60 // Adjust this value to change the speed of rotation

        // Reset the angle to prevent overflow
        if (angle >= 2 * Math.PI) {
            angle -= 2 * Math.PI
        }    }
}