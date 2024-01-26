class Area {
    canvas = document.createElement("canvas")
    start = function() {
        this.canvas.width = 800
        this.canvas.height = 800
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        this.interval = setInterval(update)
    }
    clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    size = function() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }
}