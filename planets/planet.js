class Planet {
    constructor(x, y, radius, xVelocity, yVelocity, color) {
        this.pos = new Vector(x, y)
        this.targetPos = new Vector(x, y)
        this.radius = radius
        this.velocity = new Vector(xVelocity, yVelocity)
        this.acceleration = new Vector(0, 0)
        this.color = color
    }

    update(other_planets) {
        let bounce = false
        let bounceNormal = new Vector(0, 0)
        let forces = []
        let nudge = new Vector(0, 0)
        for (let planet of other_planets) {
            if (planet != this) {
                let otherMass = planet.mass()
                let thisMass = this.mass()
                let direction = planet.pos.subtract(this.pos)
                let distance = direction.length()
                let forceLength = gravitation * thisMass * otherMass / (distance * distance)
                forces.push(direction.multiply(forceLength / distance)) // big smort
                let combinedRadius = this.radius + planet.radius
                if (distance < combinedRadius) {
                    bounce = true
                    bounceNormal = new Vector(direction.x, direction.y).normalise().add(bounceNormal).normalise()
                    nudge = nudge.subtract(direction.normalise().multiply((combinedRadius - distance) * otherMass / (thisMass + otherMass) * 1.01))
                }
                console.log(distance)
            }
        }

        let resultForce = new Vector(0, 0)
        for (let force of forces) {
            resultForce = resultForce.add(force)
        }

        this.acceleration = resultForce.multiply(gravitation / this.mass())
        this.velocity = this.velocity.add(this.acceleration.multiply(dt))
        if (bounce) {
            this.velocity = this.velocity.subtract(bounceNormal.multiply(2 * this.velocity.dot(bounceNormal))).multiply(0.97)
        }
        this.targetPos = this.pos.add(nudge).add(this.velocity.multiply(dt))
    }

    applyPos() {
        this.pos = this.targetPos
    }

    draw() {
        let camPos = camera.toWorldCoords(this.pos)
        let ctx = area.context
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(camPos.x, camPos.y, this.radius * camera.zoom, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.fill()
    }

    drawVelocity() {
        let camPos = camera.toWorldCoords(this.pos)
        let ctx = area.context
        ctx.beginPath()
        ctx.moveTo(camPos.x, camPos.y)
        ctx.lineTo(camPos.x + this.velocity.x * 1000 * camera.zoom, camPos.y + this.velocity.y * 1000 * camera.zoom)
        ctx.lineWidth = 5 * camera.zoom
        ctx.strokeStyle = "#f1f1f1"
        ctx.stroke()
    }

    mass() {
        return Math.PI * this.radius * this.radius
    }
}