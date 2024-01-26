let area = new Area()
let camera = new Camera(0, 0)

let orangePortal = new Portal(200, 200)

function init() {
    area.start()
}

function update() {
    area.clear()
    area.size()

    orangePortal.draw()
}