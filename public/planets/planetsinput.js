class PlanetsInput {
    constructor(o) {
        o.canvas = area.canvas,
        o.fontSize = 20,
        o.fontFamily = "Atkinson Hyperlegible",
        o.fontColor = "#ffffff",
        o.width = 100,
        o.padding = 10,
        o.borderWidth = 3,
        o.borderColor = "#333333",
        o.backgroundColor = "#222222"
        return new CanvasInput(o)
    }
}