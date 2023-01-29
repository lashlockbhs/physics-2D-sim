import { drawLine, drawText, setCanvas, } from "./graphics.js";
const menuCanvas = document.getElementById("menu");
const menuProps = setCanvas(menuCanvas);
const ctx = menuProps.ctx;
const width = menuProps.width;
const height = menuProps.height

let xClick;
let yClick;

class dropMenu {
    constructor(options) {
        this.options = options;
        this.boxSize = 40;
        this.textSize = this.boxSize / 3;
        this.menuHolder = document.getElementById("menuHolder")
        this.perfWindow = this.#createPerfWindow()
        this.shapeWindow = this.#createShapeWindow()

    }
    drawMenuBlocks() {
        for (let i = 0; i < this.options.length; i++) {
            console.log("hi")
            drawLine(0, this.boxSize * (i + 1), width, this.boxSize * (i + 1), "black", 1, ctx)
            drawText(this.options[i].text, 0, this.boxSize * (i + 1) - this.boxSize / 3, "black", this.textSize, ctx)
        }
    }

    #hideWindow(canvas) {
        canvas.setAttribute("hidden", "hidden");
    }
    #showWindow(canvas) {
        canvas.removeAttribute("hidden");
    }
    #checkIfDisplayed(canvas) {
        return !canvas.hidden;
    }
    #createPerfWindow() {
        const perfWindow = document.createElement("canvas");
        perfWindow.setAttribute("id", "perfWindow");

        perfWindow.width = 70;
        perfWindow.height = 110;

        this.#hideWindow(perfWindow);

        this.menuHolder.append(perfWindow);
        return perfWindow;
    }
    #createShapeWindow() {
        const shapeWindow = document.createElement("canvas");
        shapeWindow.setAttribute("id", "shapeWindow");

        shapeWindow.width = 70;
        shapeWindow.height = 110;

        this.#hideWindow(shapeWindow);

        this.menuHolder.append(shapeWindow);
        return shapeWindow;
    }

    onClick() {
        const boxNum = Math.floor(yClick / this.boxSize);
        if (boxNum === 0) {
            
            if(this.#checkIfDisplayed(this.perfWindow)){
                this.#hideWindow(this.perfWindow)
            }
            else{
                this.#showWindow(this.perfWindow)
            }
        }
    }
}

const menu = new dropMenu([{ text: "Perfect Shapes", options: ["square", "cirlce", "rect", "triange"] }, { text: "Shapes" }, { text: "World Settings" }, { text: "Debugging" }])
menu.drawMenuBlocks()

const onclick = (x, y) => {

    xClick = x;
    yClick = y;
    menu.onClick()
}
menuCanvas.onclick = (e) => onclick(e.offsetX, e.offsetY);

