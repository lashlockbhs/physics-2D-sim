import { clear, drawFilledRect, drawLine, drawText, setCanvas, } from "./graphics.js";
import { getShapes } from "./script.js"
const menuCanvas = document.getElementById("menu");
const menuProps = setCanvas(menuCanvas);
const ctx = menuProps.ctx;
const width = menuProps.width;
const height = menuProps.height;

//https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
const varToString = varObj => Object.keys(varObj)[0]


class dropMenu {
    constructor(options) {
        this.options = options;
        this.boxSize = 40;
        this.textSize = this.boxSize / 3;
        this.menuHolder = document.getElementById("menuHolder")
        this.currentWindows = [{ name: "perfWindow", hidden: true, canvas: null }, { name: "shapeWindow", hidden: true, canvas: null }];
        this.perfWindow = this.#createPerfWindow()
        this.shapeWindow = this.#createShapeWindow()

        this.currentWindows[0].canvas = this.perfWindow;
        this.currentWindows[1].canvas = this.shapeWindow;
        console.log(this.currentWindows)


    }
    drawMenuBlocks() {
        for (let i = 0; i < this.options.length; i++) {
            drawLine(0, this.boxSize * (i + 1), width, this.boxSize * (i + 1), "black", 1, ctx)
            drawText(this.options[i].text, 0, this.boxSize * (i + 1) - this.boxSize / 3, "black", this.textSize, ctx)
        }
    }
    #hideAllWindows() {
        this.currentWindows.forEach(e => this.#hideWindow(e.canvas))
    }
    #hideWindow(canvas) {
        canvas.setAttribute("hidden", "hidden");
        this.currentWindows[this.currentWindows.findIndex(e => e.name === canvas.id)].hidden = true;
    }
    #showWindow(canvas) {
        canvas.removeAttribute("hidden");
        this.currentWindows[this.currentWindows.findIndex(e => e.name === canvas.id)].hidden = false;
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

        const canvasProps = setCanvas(shapeWindow);
        const width = canvasProps.width;
        const height = canvasProps.height;
        const ctx = canvasProps.ctx;

        for (let i = 0; i<5; i++){
            console.log("Df")
            drawLine(0, (this.boxSize/2) * (i + 1), width, (this.boxSize/2) * (i + 1), "black", 1, ctx)
        }

        return shapeWindow;
    }
    #shapeWindowChangables(){
        
    }

    onClick(x, y) {
        const boxNum = Math.floor(y / this.boxSize);
        if(boxNum<this.options.length){
            clear(ctx, width, height)
            drawFilledRect(0, this.boxSize * boxNum, width, this.boxSize, "#63666A", ctx);
            this.drawMenuBlocks();
        }
        if (boxNum === 0) {
            if (this.#checkIfDisplayed(this.perfWindow)) {
                this.#hideWindow(this.perfWindow)
            }
            else {
                this.#hideAllWindows()
                this.#showWindow(this.perfWindow)
            }
        }
        else if (boxNum === 1) {
            if (this.#checkIfDisplayed(this.shapeWindow)) {
                this.#hideWindow(this.shapeWindow)
            }
            else {
                this.#hideAllWindows()
                this.#showWindow(this.shapeWindow)
            }
        }
    }
    onHover(x, y) {
        const boxNum = Math.floor(y / this.boxSize);
        if(boxNum<this.options.length){
            clear(ctx, width, height)
            drawFilledRect(0, this.boxSize * boxNum, width, this.boxSize, "#ABB0B8", ctx);
            this.drawMenuBlocks();
        }
    }
    refresh(canvasProp) {
        clear(canvasProp.ctx, canvasProp.width, canvasProp.height);
        this.drawMenuBlocks();
    }
}

const menu = new dropMenu([{ text: "Perfect Shapes", options: ["square", "cirlce", "rect", "triange"] }, { text: "Shapes", options: getShapes() }, { text: "World Settings" }, { text: "Debugging" }])
menu.drawMenuBlocks()

menuCanvas.onmousedown = (e) => menu.onClick(e.offsetX, e.offsetY);
menuCanvas.onmouseup = (e) => menu.refresh(menuProps)
menuCanvas.onmousemove = (e) => menu.onHover(e.offsetX, e.offsetY);
menuCanvas.onmouseout = (e) => menu.refresh(menuProps)
