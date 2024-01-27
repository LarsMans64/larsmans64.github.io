let area = new Area()
let camera = new Camera(0, 0)

let orangePortal = new Portal(200, 200, "#f67e3c", "#ffbb99aa", "#ffbb9900")
let bluePortal = new Portal(500, 200, "#2183e5", "#99bbffaa", "#99bbff00")

function init() {
    area.start()
}

function update() {
    area.clear()
    area.size()

    bluePortal.draw()
    orangePortal.draw()
}