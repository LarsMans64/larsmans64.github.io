class NewPlanet {
    constructor(pos) {
        this.pos = pos
        this.radius = 1
        this.drawRadius = 1
        this.color = "#50d07055"
    }

    draw() {
        this.drawRadius += (this.radius - this.drawRadius) * 0.1
        let camPos = camera.toScreenCoords(this.pos)
        let ctx = area.context
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(camPos.x, camPos.y, this.drawRadius * camera.zoom, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.fill()
    }
}
