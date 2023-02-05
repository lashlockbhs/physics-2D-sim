import { getShapes } from "./script.js"

//https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
const varToString = varObj => Object.keys(varObj)[0]


class Menu {
    constructor(options, menuHolder, hidden, xOffset, yOffset, boxWidth, boxHeight, textSize) {
        this.childs = [];
        this.options = options;
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
        this.textSize = textSize;
        this.menuHolder = menuHolder;
        this.currentWindows = [];
        this.hidden = hidden;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.elArray = [];
        this.headbar;
        this.optionsHidden = hidden;
        this.#createHeadbar()
        this.#createElements()
    }
    #createElements() {
        //create button/option elements as divs
        for (let i = 0; i < this.options.length; i++) {
            const div = document.createElement("div");
            div.setAttribute("id", this.options[i].text);
            div.style.width = this.boxWidth + "px";
            div.style.height = this.boxHeight + "px";
            let text = document.createTextNode(this.options[i].text);
            div.append(text);
            div.style.fontSize = this.textSize + "px";
            div.style.top = 10 + "px";
            div.style.left = -1 + "px";
            this.hidden ? div.style.visibility = "hidden" : div.style.display = "grid";


            div.onmousedown = (e) => { this.onClick(div); e.stopPropagation() };
            div.onmouseup = (e) => { this.refresh(div); e.stopPropagation() };
            div.onmousemove = (e) => { this.onHover(div); e.stopPropagation() };
            div.onmouseleave = (e) => { this.refresh(div); e.stopPropagation() }; //stoppropagation from chatgbt

            this.elArray.push(div);
            this.headbar.append(div);

        }
    }
    #createHeadbar(){
        this.headbar = document.createElement("div");
        this.headbar.setAttribute("id", "headbar");
        this.headbar.setAttribute("dragable", "true");
        this.headbar.style.width = this.boxWidth + "px";
        this.headbar.style.height = 10 + "px";
        this.headbar.style.left = this.xOffset + "px";
        this.headbar.style.top = this.yOffset + "px";
        this.hidden ? this.headbar.style.visibility = "hidden" : this.headbar.style.display = "grid";
        this.headbar.onclick = (e) => {
            if (e.target === this.headbar&&dragDone) {
                console.log("clicked")
                this.optionsHidden ? this.showAllEl() : this.hideAllEl()
                console.log(this.optionsHidden)
            }
        };

    
        const whileDragging = (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX; //this math was sampled from chatgpt drag functions, but I had to
                currentY = e.clientY - initialY; //scrap the rest cause it didnt work with what I wanted to do
                xOffset = currentX;
                yOffset = currentY;
                this.#setTranslate(currentX, currentY, this.headbar);
                dragDone = false;
            }
            else{
                dragDone = true;
            }
        }
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let dragDone = true;

        this.headbar.onmousedown = (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            document.onmousemove = whileDragging;
            document.onmouseup = (e) => {isDragging = false; document.onmousemove = null};
            isDragging = true;
        }
        this.headbar.onmouseup = (e) => {
            isDragging = false;
        };
        
        this.headbar.onmousemove = whileDragging;
        this.menuHolder.append(this.headbar);
    }
    createWindow(width, height, objects){
        const window =  document.createElement("div");
        window.setAttribute("id", "window");
        this.headbar.append(window)

    }
    #setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
    hideMenu() {

        this.headbar.style.visibility = "hidden";
        this.hideAllEl();
    }
    showMenu() {
        this.headbar.style.visibility = "visible";
        this.showAllEl()

    }
    showAllEl() {
        this.elArray.forEach(e => this.#showEl(e));
        this.optionsHidden = false;
    }
    hideAllEl() {
        this.elArray.forEach(e => this.#hideEl(e));
        this.optionsHidden = true;
    }
    #hideEl(el) {
        el.style.visibility = "hidden"
    }
    #showEl(el) {
        el.style.visibility = "visible"
    }
    onClick(el) {
        el.style.backgroundColor = "rgb(105, 102, 102)";
        const child = this.childs.find(e => e.button === el);
        if (child.el.hidden) {
            child.el.showMenu();
            child.el.hidden = false;
        }
        else {
            child.el.hideMenu();
            child.el.hidden = true;
        }
    }
    onHover(el) {
        el.style.backgroundColor = "rgb(155, 151, 151)";
    }
    onDrag(el) {

    }
    refresh(el) {
        el.style.backgroundColor = "rgb(200, 192, 192)";
    }

}


const shapes = getShapes();

const baseMenu = new Menu
    (
        [{ text: "Perfect Shapes" }, { text: "Shapes" }, { text: "World Settings" }, { text: "Debugging" }],//menu text

        document.getElementById("menuHolder"), //
        false, //hidden?
        0, //xoffset
        0, //yoffset
        60, //buttonWidth
        30, //buttonheight
        11, //textSize
    )
const perfShapesMenu = new Menu
    (
        [{ text: "Square" }, { text: "Circle" }, { text: "Rect" }, { text: "Triangle" }], //menu text
        document.getElementById("menuHolder"), //
        true, //hidden?
        10, //xoffset
        0,  ///yoffset
        50, //buttonWidth
        10, //buttonheight
        10, //textSize

    )
    
const shapeMenu = new Menu
    (
        [{ text:  "shape1"}, { text: "shape2" }, { text: "shape3" }, { text: "shape4" }], //menu text
        document.getElementById("menuHolder"),
        true, //hidden?
        -42, //xoffset
        0,  ///yoffset
        50, //buttonWidth
        10, //buttonheight
        10, //textSize

    )


baseMenu.childs.push(
    { el: perfShapesMenu, button: baseMenu.elArray.find(e => e.id === "Perfect Shapes") },
    { el: shapeMenu, button: baseMenu.elArray.find(e => e.id === "Shapes") }
);
