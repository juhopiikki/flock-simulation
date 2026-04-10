package com.example.flocktest

data class FlockingParametersDTO(
    val cohesionRange: Double,
    val separationRange: Double,
    val alignmentRange: Double,
    val cohesionScale: Double,
    val separationScale: Double,
    val alignmentScale: Double
)