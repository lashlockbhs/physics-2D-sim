import { drawLine, setCanvas,} from "./graphics.js";
const menuCanvas = document.getElementById("menu")
setCanvas(menuCanvas)

class dropMenu{
    constructor(options){
        this.options = options;
        this.boxSize;
    }
    drawMenuBlocks(){
        this.boxSize = menuCanvas.height/this.options.length
        for(let i = 0; i<=this.options.length; i++){
            console.log("hi")
            drawLine(0, this.boxSize*(i), menuCanvas.width, this.boxSize*(i), "black", 1)
        }
    }
    onClick(){
        const boxNum = Math.floor(yClick/this.boxSize);
    }
    #displayShapeInfo(){

    }
}

const menu = new dropMenu([])
menu.drawMenuBlocks()

let xClick;
let yClick;
const onclick = (x, y) =>{
    
    xClick = x;
    yClick = y;
    menu.onClick()
}
menuCanvas.onclick = (e) => onclick(e.offsetX, e.offsetY);

