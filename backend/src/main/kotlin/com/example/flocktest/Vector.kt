package com.example.flocktest

import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

data class Vector(var x: Double, var y: Double) {
    fun add(other: Vector): Vector {
        this.x += other.x
        this.y += other.y
        return this
    }

    fun subtract(other: Vector): Vector {
        this.x -= other.x
        this.y -= other.y
        return this
    }

    fun multiply(scalar: Double): Vector {
        this.x *= scalar
        this.y *= scalar
        return this
    }

    fun divide(scalar: Double): Vector {
        if (scalar != 0.0) {
            this.x /= scalar
            this.y /= scalar
        }
        return this
    }

    fun magnitude(): Double = sqrt(x * x + y * y)

    fun normalize(): Vector {
        val mag = magnitude()
        if (mag > 0) {
            divide(mag)
        }
        return this
    }

    fun limit(max: Double): Vector {
        if (magnitude() > max) {
            normalize().multiply(max)
        }
        return this
    }

    fun distance(other: Vector): Double = sqrt((other.x - x).pow(2.0) + (other.y - y).pow(2.0))

    fun wrap() {
        if (x > 800) x = -800.0 else if (x < -800) x = 800.0
        if (y > 400) y = -400.0 else if (y < -400) y = 400.0
    }

    companion object {
        fun random(): Vector {
            val angle = Math.random() * Math.PI * 2
            return Vector(cos(angle) * 150, sin(angle) * 150)
        }
    }
}