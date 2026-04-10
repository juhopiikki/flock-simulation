package com.example.flocktest.controllers

import com.example.flocktest.FlockingParametersDTO
import com.example.flocktest.components.FlockSimulator
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/parameters")
class FlockingParametersController(
    val flockSimulator: FlockSimulator
) {
    @CrossOrigin(origins = ["http://localhost:5173/", "http://127.0.0.1:5173/"])
    @PostMapping("/update")
    fun updateFlockingParameters(@RequestBody parameters: FlockingParametersDTO): String {
        println("Received parameters: $parameters")
        flockSimulator.aliScale = parameters.alignmentScale
        flockSimulator.cohScale = parameters.cohesionScale
        flockSimulator.sepScale = parameters.separationScale

        flockSimulator.aliRange = parameters.alignmentRange
        flockSimulator.cohRange = parameters.cohesionRange
        flockSimulator.sepRange = parameters.separationRange
        return "Parameters updated successfully"
    }

    @CrossOrigin(origins = ["http://localhost:5173/", "http://127.0.0.1:5173/"])
    @PostMapping("/reset")
    fun resetSimulation(@RequestBody(required = false) body: Map<String, Int>?): String {
        val amount = body?.get("amount")
        println("Resetting with amount: $amount")
        if (amount != null) flockSimulator.reset(amount) else flockSimulator.reset()
        return "Reset done"
    }

    @CrossOrigin(origins = ["http://localhost:5173/", "http://127.0.0.1:5173/"])
    @GetMapping("/current")
    fun getCurrentParameters(): FlockingParametersDTO {
        return FlockingParametersDTO(
            alignmentScale = flockSimulator.aliScale,
            cohesionScale = flockSimulator.cohScale,
            separationScale = flockSimulator.sepScale,
            alignmentRange = flockSimulator.aliRange,
            cohesionRange = flockSimulator.cohRange,
            separationRange = flockSimulator.sepRange
        )
    }

    @CrossOrigin(origins = ["http://localhost:5173/", "http://127.0.0.1:5173/"])
    @PostMapping("/randomize")
    fun randomizeParameters(): FlockingParametersDTO {
        fun rand(min: Double, max: Double) = Math.round((min + Math.random() * (max - min)) * 10) / 10.0
        flockSimulator.aliScale = rand(0.5, 4.0)
        flockSimulator.cohScale = rand(0.5, 4.0)
        flockSimulator.sepScale = rand(0.5, 4.0)
        flockSimulator.aliRange = rand(2.0, 10.0)
        flockSimulator.cohRange = rand(2.0, 10.0)
        flockSimulator.sepRange = rand(2.0, 10.0)
        println("Randomized parameters")
        return getCurrentParameters()
    }
}
