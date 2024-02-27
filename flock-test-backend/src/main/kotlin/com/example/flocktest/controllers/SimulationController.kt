package com.example.flocktest.controllers

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import kotlin.random.Random

@Controller
class SimulationController {
    @GetMapping("/simulate")
    @SendTo("/topic/position")
    fun simulateDotPosition(): Position {
        // Simulate dot position updates
        val position = Position(Random.nextInt(100), Random.nextInt(100))
        Thread.sleep(100)  // Simulate processing time
        return position
    }

    data class Position(val x: Int, val y: Int)
}