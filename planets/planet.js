class Planet {
    constructor(x, y, radius, xVelocity, yVelocity, color) {
        this.pos = new Vector(x, y)
        this.targetPos = new Vector(x, y)
        this.radius = radius
        this.velocity = new Vector(xVelocity, yVelocity)
        this.acceleration = new Vector(0, 0)
        this.color = color
        this.mass = Math.PI * radius * radius
    }

    update(other_planets) {
        let bounce = false
        let bounceMass = 0
        let bounceSpeed = 0
        let bounceNormal = new Vector(0, 0)
        let forces = []
        let nudge = new Vector(0, 0)
        for (let planet of other_planets) {
            if (planet != this) {
                let direction = planet.pos.subtract(this.pos)
                let distance = direction.length()
                let forceLength = gravitation * this.mass * planet.mass / (distance * distance)
                forces.push(direction.multiply(forceLength / distance)) // big smort
                let combinedRadius = this.radius + planet.radius
                if (distance < combinedRadius) {
                    bounce = true
                    bounceMass = planet.mass
                    bounceSpeed = planet.velocity.length()
                    bounceNormal = new Vector(direction.x, direction.y).normalise()
                    nudge = nudge.subtract(direction.normalise().multiply((combinedRadius - distance) * planet.mass / (this.mass + planet.mass) * 1.01))
                }
            }
        }

        let resultForce = new Vector(0, 0)
        for (let force of forces) {
            resultForce = resultForce.add(force)
        }

        this.acceleration = resultForce.multiply(gravitation / this.mass)
        this.velocity = this.velocity.add(this.acceleration.multiply(dt))
        if (bounce) {
            let speed = this.velocity.length()
            this.velocity = this.velocity.subtract(bounceNormal.multiply(2 * this.velocity.dot(bounceNormal))) // change direction
                // .normalise().multiply(((this.mass - bounceMass) * speed + 2 * this.mass * -bounceSpeed) / (this.mass + bounceMass)) // change velocities
                //.multiply(0.97)
        }
        this.targetPos = this.pos.add(nudge).add(this.velocity.multiply(dt))
    }

    applyPos() {
        this.pos = this.targetPos
    }

    draw() {
        let camPos = camera.toScreenCoords(this.pos)
        let ctx = area.context
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(camPos.x, camPos.y, this.radius * camera.zoom, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.fill()
    }
    
    drawLineFromCenter(vector, length) {
        let camPos = camera.toScreenCoords(this.pos)
        let ctx = area.context

        let drawVector = vector.multiply(length * camera.zoom)

        ctx.beginPath()
        ctx.moveTo(camPos.x, camPos.y)
        ctx.lineTo(camPos.x + drawVector.x, camPos.y + drawVector.y)
        ctx.lineWidth = Math.min(0.2 * camera.zoom * this.radius, 4)
        ctx.strokeStyle = "#f1f1f1"
        ctx.stroke()
    }

    drawText(string) {
        let ctx = area.context
        let screenPos = camera.toScreenCoords(this.pos)
        ctx.textAlign = "center"
        ctx.fillStyle = "#f1f1f1"
        ctx.fillText(string, screenPos.x, screenPos.y - this.radius * camera.zoom - 5)
    }

    drawVelocity() {
        this.drawLineFromCenter(this.velocity, 1000)
        this.drawText(roundToSignificantDigits(this.velocity.multiply(10).length(), 4).toString())
    }

    drawAcceleration() {
        this.drawLineFromCenter(this.acceleration, 300_000)
        this.drawText(roundToSignificantDigits(this.acceleration.multiply(300_000).length(), 4).toString())
    }
}