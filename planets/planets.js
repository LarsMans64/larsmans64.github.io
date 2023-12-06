/* TODO:
 * - scrollbar gon
 * - move with mouse
 * - create planets
 * - fix collisions
 * - manipulate time / gravity
 * 
 */

const gravitation = 0.05
let planets = []
let time = new Date().getTime()
const debug = false

let area = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800
        this.canvas.height = 800
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.interval = setInterval(update, 1/60)
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    size : function() {
        this.canvas.width = window.innerWidth * 3
        this.canvas.height = window.innerHeight * 3
    }
}

function init() {
    area.start()
    planets = [
        new Planet(1000, 500, 40, 0, 0, "#50d070"),
        new Planet(1500, 600, 20, 0, 0.1, "#50d070"),
        new Planet(500, 200, 30, 0.1, -0.06, "#50d070"),
        new Planet(200, 700, 20, 0, 0.1, "#50d070")
    ]
    // planets = [
    //     new Planet(800, 500, 60, -0.1, 0, "#50d070"),
    //     new Planet(500, 550, 60, 0.1, 0, "#50d070")
    // ]
}

function update() {
    let now = new Date().getTime()
    dt = now - time
    time = now;

    area.clear()
    area.size()
    let old_planets = [...planets]
    for (let planet of planets) {
        planet.update(old_planets)
        planet.draw()
        if (debug) {
            planet.drawVelocity()
        }
    }
}

class Planet {
    constructor(x, y, radius, xVelocity, yVelocity, color) {
        this.pos = new Vector(x, y)
        this.radius = radius
        this.velocity = new Vector(xVelocity, yVelocity)
        this.acceleration = new Vector(0, 0)
        this.color = color
    }

    update(planets) {
        let bounce = false
        let bounceNormal = new Vector(0, 0)
        let forces = []
        for (let planet of planets) {
            if (planet != this) {
                let direction = planet.pos.subtract(this.pos)
                let distance = direction.length()
                let forceLength = gravitation * this.mass() * planet.mass() / (distance * distance)
                forces.push(direction.multiply(forceLength / distance)) // big smort
                if (distance < this.radius + planet.radius) {
                    bounce = true
                    bounceNormal = new Vector(direction.x, direction.y).normalise()
                }
            }
        }
        let resultForce = new Vector(0, 0)
        for (let force of forces) {
            resultForce = resultForce.add(force)
        }

        this.acceleration = resultForce.multiply(gravitation / this.mass())
        this.velocity = this.velocity.add(this.acceleration.multiply(dt))
        if (bounce) {
            this.velocity = this.velocity.subtract(bounceNormal.multiply(2 * this.velocity.dot(bounceNormal))).multiply(0.99)
        }
        this.pos = this.pos.add(this.velocity.multiply(dt))
        console.log(this.pos)
    }

    draw() {
        let ctx = area.context
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.fill()
        // ctx.lineWidth = 5
        // ctx.strokeStyle = this.color
        // ctx.stroke()
    }

    drawVelocity() {
        let ctx = area.context
        ctx.beginPath()
        ctx.moveTo(this.pos.x, this.pos.y)
        ctx.lineTo(this.pos.x + this.velocity.x * 1000, this.pos.y + this.velocity.y * 1000)
        ctx.lineWidth = 5
        ctx.strokeStyle = "#f1f1f1"
        ctx.stroke()
    }

    mass() {
        return Math.PI * this.radius * this.radius
    }
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y)
    }

    subtract(vec2) {
        return new Vector(this.x - vec2.x, this.y - vec2.y)
    }

    multiply(number) {
        return new Vector(this.x * number, this.y * number)
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    normalise() {
        let length = this.length()
        return new Vector(this.x / length, this.y / length)
    }

    setAngle(angle) {
        length = this.length()
        return new Vector(Math.cos(angle) * length, Math.sin(angle) * length)
    }

    getAngle() {
        return Math.atan(this.y / this.x)
    }

    rotate(angle) {
        return new this.setAngle(this.getAngle + angle)
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y
    }
}