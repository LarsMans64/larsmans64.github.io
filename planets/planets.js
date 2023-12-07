/* TODO:
 * - scrollbar gon
 * - move with mouse/keyboard
 * - create planets
 * - fix collisions
 * - manipulate time / gravity
 * 
 */

let area = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800
        this.canvas.height = 800
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.interval = setInterval(update, 1/60)
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    size: function() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case "ArrowLeft":
            camera.left = true
            break
        case "ArrowRight":
            camera.right = true
            break
        case "ArrowUp":
            camera.up = true
            break
        case "ArrowDown":
            camera.down = true
            break
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case "ArrowLeft":
            camera.left = false
            break
        case "ArrowRight":
            camera.right = false
            break
        case "ArrowUp":
            camera.up = false
            break
        case "ArrowDown":
            camera.down = false
            break
    }
})

document.addEventListener('wheel', function(event) {
    if (event.deltaY > 0) {
        camera.targetZoom *= camera.zoomStep
    } else {
        camera.targetZoom /= camera.zoomStep
    }
})

// document.addEventListener('mousedown', function(event) {
//     camera.mouseDown = true
//     camera.mousePos = new Vector(event.clientX, event.clientY)
// })

// document.addEventListener('mouseup', function(event) {
//     camera.mouseDown = false
// })

document.addEventListener('mousemove', function(event) {
    if (event.buttons == 1) {
        camera.pos = camera.pos.subtract(new Vector(event.movementX, event.movementY))
    }
})

function init() {
    area.start()
    planets = [
        new Planet(1000, 500, 40, 0, 0, "#50d070"),
        new Planet(1500, 600, 20, 0, 0.1, "#50d070"),
        new Planet(500, 200, 30, 0.1, -0.06, "#50d070"),
        new Planet(200, 700, 20, 0, 0.1, "#50d070")
    ]
    // planets = [
    //     new Planet(800, 500, 30, 0, 0.1, "#50d070"),
    //     new Planet(500, 550, 60, 0, 0, "#50d070")
    // ]
}

function update() {
    let now = new Date().getTime()
    dt = now - time
    time = now;

    area.clear()
    area.size()

    camera.update()

    let old_planets = Array.from(planets)
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
                    bounceNormal = new Vector(direction.x, direction.y).normalise().add(bounceNormal).normalise()
                    this.pos = this.pos.subtract(direction.normalise().multiply(0.5 * (this.radius + planet.radius - distance)))
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
    }

    draw() {
        let camPos = camera.toWorldCoords(this.pos)
        // let camPos = this.pos.subtract(camera.pos) 
        let ctx = area.context
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(camPos.x, camPos.y, this.radius * camera.zoom, 0, 2 * Math.PI, false)
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

class Camera {
    constructor(x, y) {
        this.pos = new Vector(x, y)
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
        this.speed = 0.02
        this.up = false
        this.down = false
        this.left = false
        this.right = false
        this.zoom = 1
        this.zoomStep = 0.9
        this.targetZoom = 1
        this.mouseDown = false
        this.mousePos = new Vector(0, 0)
    }

    update() {
        this.acceleration = new Vector(0, 0)

        if (this.left) this.accelerate(-1, 0)
        if (this.right) this.accelerate(1, 0)
        if (this.up) this.accelerate(0, -1)
        if (this.down) this.accelerate(0, 1)

        this.velocity = this.velocity.multiply(0.993 ** dt)
        this.velocity = this.velocity.add(this.acceleration.multiply(dt))
        this.pos = this.pos.add(this.velocity.multiply(dt))

        this.zoom += (this.targetZoom - this.zoom) * 0.1
    }

    accelerate(x, y) {
        this.acceleration = this.acceleration.add(new Vector(x * this.speed, y * this.speed))
    }

    middle() {
        return this.pos.add(new Vector(window.innerWidth * 0.5, window.innerHeight * 0.5))
    }

    toWorldCoords(vec) {
        return vec.multiply(this.zoom).subtract(this.pos)
    }
}

const gravitation = 0.05
const debug = false

let planets = []
let time = new Date().getTime()
let camera = new Camera(0, 0)