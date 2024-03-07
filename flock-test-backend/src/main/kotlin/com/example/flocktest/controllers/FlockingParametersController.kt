package com.example.flocktest.controllers

import com.example.flocktest.FlockingParametersDTO
import com.example.flocktest.components.FlockSimulator
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/parameters")
class FlockingParametersController(
    val flockSimulator: FlockSimulator
) {

    @CrossOrigin(origins = ["http://localhost:5173/"]) // Adjust as necessary
    @PostMapping("/update")
    fun updateFlockingParameters(@RequestBody parameters: FlockingParametersDTO): String {
        // Logic to update your simulation parameters here
        println("Received parameters: $parameters")
        flockSimulator.aliScale = parameters.alignmentScale
        flockSimulator.cohScale = parameters.cohesionScale
        flockSimulator.sepScale = parameters.separationScale

        flockSimulator.aliRange = parameters.alignmentRange
        flockSimulator.cohRange = parameters.cohesionRange
        flockSimulator.sepRange = parameters.separationRange
        return "Parameters updated successfully"
    }

    @CrossOrigin(origins = ["http://localhost:5173/"]) // Adjust as necessary
    @PostMapping("/reset")
    fun resetSimulation(): String {
        // Logic to update your simulation parameters here
        println("Resetting")
        flockSimulator.reset()
        return "Reset done"
    }


}