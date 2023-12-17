class NewPlanet {
    constructor(pos) {
        this.pos = pos
        this.radius = 1
        this.color = "#50d07088"
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
}
