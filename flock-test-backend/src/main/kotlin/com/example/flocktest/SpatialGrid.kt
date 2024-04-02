package com.example.flocktest

class SpatialGrid(private val cellSize: Double, private val width: Double, private val height: Double) {
    private val cols = (width / cellSize).toInt()
    private val rows = (height / cellSize).toInt()
    private val grid = Array(cols * rows) { mutableListOf<Boid>() }

    private fun index(x: Int, y: Int): Int = x + y * cols

    fun addBoid(boid: Boid) {
        val offsetX = width / 2  // Offset to transform the position
        val offsetY = height / 2

        val col = ((boid.position.x + offsetX) / cellSize).toInt().coerceIn(0, cols - 1)
        val row = ((boid.position.y + offsetY) / cellSize).toInt().coerceIn(0, rows - 1)
        grid[index(col, row)].add(boid)
    }

    fun clear() {
        for (cell in grid) {
            cell.clear()
        }
    }

    fun getNeighbors(boid: Boid): List<Boid> {
        val neighbors = mutableListOf<Boid>()

        val offsetX = width / 2  // Offset to transform the position
        val offsetY = height / 2

        val col = ((boid.position.x + offsetX) / cellSize).toInt().coerceIn(0, cols - 1)
        val row = ((boid.position.y + offsetY) / cellSize).toInt().coerceIn(0, rows - 1)

        for (i in -1..1) {
            for (j in -1..1) {
                val newCol = (col + i).coerceIn(0, cols - 1)
                val newRow = (row + j).coerceIn(0, rows - 1)
                neighbors.addAll(grid[index(newCol, newRow)])
            }
        }
        return neighbors
    }
}