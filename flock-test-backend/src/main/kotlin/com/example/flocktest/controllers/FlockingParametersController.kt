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
    fun resetSimulation(): String {
        println("Resetting")
        flockSimulator.reset()
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
}
