/* 
 * TODO:
 * - grid
 * - give new planet velocity
 * - selection highlight
 * - selection info / change planet variables (pos, speed, acceleration, energy, color)
 * - menu with info / constants (gravity, simulation speed, total energy, ...)
 * - change lines to arrows
 * - more planet colors, randomization
 * 
 */

let area = new Area()

let planets = [
    new Planet(1000, 500, 70, 0, 0, "#50d070"),
    new Planet(1500, 600, 20, 0, 0.1, "#50d070"),
    new Planet(500, 200, 30, 0.1, -0.06, "#50d070"),
    new Planet(200, 700, 20, 0, 0.1, "#50d070"),
    new Planet(1700, 100, 20, 0, 0, "#50d070"),
    new Planet(10, 100, 7, 0, 0.2, "#50d070"),
]
// let planets = [
//     new Planet(1500, 500, 50, 0, 0, "#50d070"),
//     new Planet(500, 500, 50, 0, 0, "#50d070")
// ]

let removedPlanets = []

let gravitation = 0.05
let debug = 0
let time = new Date().getTime()
let dt = 0
let camera = new Camera(0, 0)
let paused = false
let newPlanet = null
let textLine = 0
let selectedPlanet = null
let inputs = []

function init() {
    area.start()
}

function update() {
    let now = new Date().getTime()
    dt = now - time
    if (dt > 50) {
        dt = 50
    }
    time = now;

    area.clear()
    area.size()
    
    area.context.font = "20px Atkinson Hyperlegible"

    camera.update()

    if (!paused) {
        for (let planet of planets) {
            planet.update(planets)
        }

        for (let planet of planets) {
            planet.applyPos()
        }
    }

    if (selectedPlanet != null) {
        camera.setMiddle(selectedPlanet.pos)
        // if (inputs.length == 0) {
        //     inputs.push(new PlanetsInput({
        //         x: window.innerWidth - 200,
        //         y: 50,
        //         placeHolder: "Color",
        //         onsubmit: function() {selectedPlanet.color = this.value()}
        //     }))
        // }
    }

    for (let planet of planets) {
        planet.draw()
        if (debug == 1) {
            planet.drawVelocity()
        }
        if (debug == 2) {
            planet.drawAcceleration()
        }
    }

    drawText("Left click to pan")
    drawText("Right click to create a new planet")
    drawText("Scroll to zoom")
    drawText("")
    drawText("D = Cycle debug")
    drawText("R = Remove all planets")
    drawText("SPACE = Pause")
    
    if (newPlanet != null) {
        newPlanet.draw()
    }

    for (let input of inputs) {
        input.render()
    }

    textLine = 0
}

function cycleDebug() {
    debug += 1
    if (debug > 2) {
        debug = 0
    }
}

function drawText(text) {
    let ctx = area.context
    ctx.fillStyle = "#ffffff44"
    ctx.textAlign = "start"
    ctx.textBaseline = "hanging"
    ctx.fillText(text, 20, 20 + textLine * 20)
    textLine += 1
}

function roundToSignificantDigits(number, digits) {
    let floor = Math.floor(number)
    let afterDot = digits - floor.toString().length
    if (afterDot > 0) {
        let e = 10 ** afterDot
        return Math.round(number * e) / e
    }
    return floor
}

function removeLatestPlanet() {
    if (planets.length > 0) {
        removedPlanets.push(planets.pop())
    }
}

function restoreLatestPlanet() {
    if (removedPlanets.length > 0) {
        planets.push(removedPlanets.pop())
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
        case "d":
            cycleDebug()
            break
        case "r":
            planets = []
            break
        case " ":
            paused = !paused
            break
        case "z":
            if (event.ctrlKey) {
                removeLatestPlanet()
            }
            break
        case "y":
            if (event.ctrlKey) {
                restoreLatestPlanet()
            }
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

document.addEventListener('mousedown', function(event) {
    if (event.movementX == 0 && event.movementY == 0 && event.buttons == 1) {
        // if (event.clientX < window.innerWidth - 200) {
            selectedPlanet = null
        // }
        for (let planet of planets) {
            let mouseCoords = camera.toWorldCoords(new Vector(event.clientX, event.clientY))
            if (planet.pos.subtract(mouseCoords).length() <= planet.radius) {
                selectedPlanet = planet
            }
        }
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
        camera.pos = camera.pos.subtract(new Vector(event.movementX, event.movementY).multiply(1/camera.zoom))
    }
    if (newPlanet != null) {
        newPlanet.radius = newPlanet.pos.subtract(camera.toWorldCoords(new Vector(event.clientX, event.clientY))).length()
    }
})

document.addEventListener('contextmenu', function(event) {
    event.preventDefault()
    coords = camera.toWorldCoords(new Vector(event.clientX, event.clientY))
    if (newPlanet == null) {
        newPlanet = new NewPlanet(coords)
    } else if (newPlanet.radius > 0) {
        planets.push(new Planet(newPlanet.pos.x, newPlanet.pos.y, newPlanet.radius, 0, 0, "#50d070"))
        newPlanet = null
    }
    return false
}, false)
