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

const gravitation = 0.05
const debug = false

let planets = [
    new Planet(1000, 500, 40, 0, 0, "#50d070"),
    new Planet(1500, 600, 20, 0, 0.1, "#50d070"),
    new Planet(500, 200, 30, 0.1, -0.06, "#50d070"),
    new Planet(200, 700, 20, 0, 0.1, "#50d070")
]
// let planets = [
//     new Planet(800, 500, 30, 0, 0.1, "#50d070"),
//     new Planet(500, 550, 60, 0, 0, "#50d070")
// ]
let time = new Date().getTime()
let camera = new Camera(0, 0)

function init() {
    area.start()
}

function update() {
    let now = new Date().getTime()
    dt = now - time
    time = now;

    area.clear()
    area.size()

    camera.update()

    for (let planet of planets) {
        planet.update(planets)
    }

    for (let planet of planets) {
        planet.applyPos()
    }

    for (let planet of planets) {
        planet.draw()
        if (debug) {
            planet.drawVelocity()
        }
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
})

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

document.addEventListener('mousemove', function(event) {
    if (event.buttons == 1) {
        camera.pos = camera.pos.subtract(new Vector(event.movementX, event.movementY))
    }
})