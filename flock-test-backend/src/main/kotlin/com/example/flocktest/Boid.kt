package com.example.flocktest

import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.sin

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
        boids: List<Boid>,
        center: Vector,
        sepScale: Double, // = 10 * Math.random(),
        aliScale: Double, // = 10 * Math.random(),
        cohScale: Double, // = 10 * Math.random(),
        alignmentViewRange: Double,
        cohesionViewRange: Double,
        separationViewRange: Double
    ) {
        val maxRange = max(max(alignmentViewRange, cohesionViewRange), separationViewRange)
        val filteredBoids = boids.filter { boid -> boid.position.distance(this.position) < maxRange}
        val sep = separate(filteredBoids, separationViewRange) // Separation
        val ali = align(filteredBoids, alignmentViewRange)    // Alignment
        val coh = cohesion(filteredBoids, cohesionViewRange) // Cohesion
        val flockCenterForce = flockCcenter(center)
        val centerForce = center()

        // Arbitrarily weight these forces
        // sep.multiply(2.5)
        // ali.multiply(1.5) // Adjust these weights as needed
        // coh.multiply(1.0)

        // println("sepScale: $sepScale")
        // println("aliScale: $aliScale")
        // println("cohScale: $cohScale")
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

        position.wrap() // Ensure the position wraps around the boundary
        acceleration.multiply(0.0) // Optionally reset acceleration after each update

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
        val neighbordist = alignmentViewRange
        val sum = Vector(0.0, 0.0)
        var count = 0
        boids.forEach { other ->
            val d = position.distance(other.position) // Vector.distance(position, other.position)
            if (d > 0 && d < neighbordist) {
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

    private fun flockCcenter(center: Vector): Vector {
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

    /*
    companion object {
        const val VIEW_RANGE = 100.0 // How far the boid can see (for cohesion and alignment)
        const val MIN_DISTANCE = 10.0 // Minimum distance from other boids (for separation)
        const val MAX_SPEED = 0.8
    }

    fun update(boids: List<Boid>) {
        val separation = separate(boids)//.scale(1.5) // Adjust weighting as necessary
        val alignment = align(boids)//.scale(1.0)
        val cohesion = cohesion(boids)//.scale(1.0)

        velocity = velocity.add(separation).add(alignment.divide(2.0)).add(cohesion.divide(1.5))
        velocity = velocity.limit(MAX_SPEED)
        position = position.add(velocity)
    }

    private fun separate(boids: List<Boid>): Vector {
        val desiredSeparation = MIN_DISTANCE
        val steer = Vector(0.0, 0.0)
        var count = 0
        for (other in boids) {
            val distance = position.distance(other.position)
            if (distance > 0 && distance < desiredSeparation) {
                var diff = position.subtract(other.position).normalize().divide(distance)
                steer.add(diff)
                count++
            }
        }
        if (count > 0) {
            steer.divide(count.toDouble())
        }
        return steer
    }

    private fun align(boids: List<Boid>): Vector {
        val neighbordist = VIEW_RANGE
        val sum = Vector(0.0, 0.0)
        var count = 0
        for (other in boids) {
            val distance = position.distance(other.position)
            if (distance > 0 && distance < neighbordist) {
                sum.add(other.velocity)
                count++
            }
        }
        if (count > 0) {
            sum.divide(count.toDouble()).normalize().multiply(MAX_SPEED)
            val steer = sum.subtract(velocity).limit(MAX_SPEED)
            return steer
        } else {
            return Vector(0.0, 0.0)
        }
    }

    private fun cohesion(boids: List<Boid>): Vector {
        val neighbordist = VIEW_RANGE
        val sum = Vector(0.0, 0.0) // Start with empty vector to accumulate all positions
        var count = 0
        for (other in boids) {
            val distance = position.distance(other.position)
            if (distance > 0 && distance < neighbordist) {
                sum.add(other.position) // Add location
                count++
            }
        }
        if (count > 0) {
            sum.divide(count.toDouble()) // Divide to get the average position
            return seek(sum) // Steer towards the position
        } else {
            return Vector(0.0, 0.0)
        }
    }

    private fun seek(target: Vector): Vector {
        val desired = target.subtract(position) // A vector pointing from the position to the target
        desired.normalize().multiply(MAX_SPEED)
        // Steering = Desired minus velocity
        val steer = desired.subtract(velocity).limit(MAX_SPEED)
        return steer
    }*/
}

