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