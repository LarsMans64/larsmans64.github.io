class Portal {
    constructor(x, y, color, innerShine, outerShine) {
        this.pos = new Vector(x, y)
        this.rotation = 0
        this.height = 15
        this.width = 120
        this.link = 0
        this.color = color
        this.innerShine = innerShine
        this.outerShine = outerShine
    }

    draw() {
        this.rotation += 0.005
        let camPos = camera.toScreenCoords(this.pos)
        let ctx = area.context
        ctx.save()
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.translate(camPos.x, camPos.y + 5)
        ctx.rotate(this.rotation)
        ctx.roundRect(this.width * -0.5, this.height * -0.5, this.width, this.height, 1000)
        ctx.fill()
        let gradient = ctx.createLinearGradient(0, this.height * 0.5, 0, this.height * 1.5)
        gradient.addColorStop(0, this.innerShine)
        gradient.addColorStop(1, this.outerShine)
        ctx.fillStyle = gradient
        ctx.fillRect(this.width * -0.5 + this.height * 0.4, this.height * 0.5, this.width - this.height * 0.8, this.height, 100)
        ctx.restore()
    }
}