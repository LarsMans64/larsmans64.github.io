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
        return vec.subtract(this.middle()).multiply(this.zoom).add(new Vector(window.innerWidth * 0.5, window.innerHeight * 0.5))
    }
}