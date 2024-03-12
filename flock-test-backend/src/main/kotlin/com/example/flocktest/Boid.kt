package com.example.flocktest

import kotlin.math.abs
import kotlin.math.max

class Boid(var position: Vector, var velocity: Vector) {
    var acceleration = Vector(0.0, 0.0)

    companion object {
        // const val VIEW_RANGE_ALIGN = 8.0
        // const val VIEW_RANGE_COH = 5.0
        // const val VIEW_RANGE_SEPARATION = 3.0
        // const val MAX_SPEED = 2.0
        // const val MAX_FORCE = 0.3
        // const val VIEW_RANGE_ALIGN = 8.0
        // const val VIEW_RANGE_COH = 3.0
        // const val VIEW_RANGE_SEPARATION = 5.0
        const val MAX_SPEED = 2.0
        const val MAX_FORCE = 0.3
        // const val VIEW_RANGE_ALIGN = 10.0
        // const val VIEW_RANGE_COH = 5.0
        // const val VIEW_RANGE_SEPARATION = 10.0
        // const val MAX_SPEED = 4.0
        // const val MAX_FORCE = 0.4
    }

    fun applyBehaviors(
        neighbours: List<Boid>,
        center: Vector,
        sepScale: Double, // = 10 * Math.random(),
        aliScale: Double, // = 10 * Math.random(),
        cohScale: Double, // = 10 * Math.random(),
        alignmentViewRange: Double,
        cohesionViewRange: Double,
        separationViewRange: Double
    ) {
        val maxRange = max(max(alignmentViewRange, cohesionViewRange), separationViewRange)
        val filteredBoids = neighbours.filter { boid -> boid.position.distance(this.position) < maxRange }

        val sep = separate(filteredBoids, separationViewRange) // Separation
        val ali = align(filteredBoids, alignmentViewRange)    // Alignment
        val coh = cohesion(filteredBoids, cohesionViewRange) // Cohesion

        val flockCenterForce = flockCenter(center)
        val centerForce = center()

        // Arbitrarily weight these forces
        // sep.multiply(2.5)
        // ali.multiply(1.5) // Adjust these weights as needed
        // coh.multiply(1.0)

        // random weights
        sep.multiply(sepScale)
        ali.multiply(aliScale) // Adjust these weights as needed
        coh.multiply(cohScale)
        flockCenterForce.multiply(0.000001)
        centerForce.multiply(0.000001)

        // Add the force vectors to acceleration
        acceleration.add(sep).add(ali).add(coh).add(flockCenterForce).add(centerForce)

        velocity.add(acceleration)
        velocity.limit(MAX_SPEED)
        position.add(velocity)

        // add a bit randomness
        // position.add (Vector(Math.random() * 0.1, Math.random() * 0.1))

        // position.wrap() // Ensure the position wraps around the boundary
        acceleration.multiply(0.7) // Optionally reset acceleration after each update

        // position = position.add(acceleration)
    }

    // Separation: Steer to avoid crowding local flockmates
    private fun separate(boids: List<Boid>, separationViewRange: Double): Vector {
        val desiredSeparation = separationViewRange
        val steer = Vector(0.0, 0.0)
        var count = 0
        boids.forEach { other ->
            val d = position.distance(other.position) // Vector.distance(position, other.position)
            if (d > 0 && d < desiredSeparation) {
                val diff = position.copy().subtract(other.position).normalize().divide(d)
                steer.add(diff)
                count++
            }
        }
        if (count > 0) {
            steer.divide(count.toDouble())
        }
        return steer.limit(MAX_FORCE)
    }

    // Alignment: Steer towards the average heading of local flockmates
    private fun align(boids: List<Boid>, alignmentViewRange: Double): Vector {
        val sum = Vector(0.0, 0.0)
        var count = 0
        boids.forEach { other ->
            val d = position.distance(other.position) // Vector.distance(position, other.position)
            if (d > 0 && d < alignmentViewRange) {
                sum.add(other.velocity)
                count++
            }
        }
        return if (count > 0) {
            sum.divide(count.toDouble()).normalize().multiply(MAX_SPEED).subtract(velocity).limit(MAX_FORCE)
        } else {
            Vector(0.0, 0.0)
        }
    }

    // Cohesion: Steer to move toward the average position of local flockmates
    private fun cohesion(boids: List<Boid>, cohesionViewRange: Double): Vector {
        val neighbordist = cohesionViewRange
        val sum = Vector(0.0, 0.0)
        var count = 0
        boids.forEach { other ->
            val d = position.distance(other.position)
            if (d > 0 && d < neighbordist) {
                sum.add(other.position)
                count++
            }
        }
        return if (count > 0) {
            sum.divide(count.toDouble()).subtract(position).limit(MAX_FORCE)
        } else {
            Vector(0.0, 0.0)
        }
    }

    private fun flockCenter(center: Vector): Vector {
        val distanceToCenter = Vector(this.position.x - center.x, this.position.y - center.y)
        val distanceSquaredOpposite = Vector(-distanceToCenter.x * abs(distanceToCenter.x),
                -distanceToCenter.y * abs(distanceToCenter.y))
        return distanceSquaredOpposite
    }

    private fun center(): Vector {
        val distanceSquaredOpposite = Vector(-this.position.x * abs(this.position.x),
                -this.position.y * abs(this.position.y))
        return distanceSquaredOpposite
    }
}

