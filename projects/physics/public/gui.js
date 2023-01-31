import { getShapes } from "./script.js"

//https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
const varToString = varObj => Object.keys(varObj)[0]


class dropMenu {
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
        this.#createElements()
    }
    #createElements(){
        this.headbar = document.createElement("div");
        this.headbar.setAttribute("id", "headbar");
        this.headbar.style.width = this.boxWidth + "px";
        this.headbar.style.height = 10 + "px";
        this.headbar.style.left = this.xOffset + "px";
        this.headbar.style.top = this.yOffset + "px";
        //this.headbar.ondrag
        this.menuHolder.append(this.headbar);

        const triUp = "&#9650;";
        const triDown = "&#9660;";
        let state = "down";
        const triangle = document.createElement("div")
        triangle.setAttribute("id", "triangle")
        triangle.innerHTML = (triDown);
        this.headbar.append(triangle);

        triangle.onclick = () => 
        {
            if(state === "up"){
                triangle.innerHTML = triDown;
                console.log(triangle.innerHTML + " down")
                state = "down"
                this.showAllEl();
            }
            else{
                triangle.innerHTML = triUp;
                console.log(triangle.innerHTML + " up")
                state = "up"
                this.hideAllEl();
            }
        };
        
        


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
        console.log(this.elArray)
    }
    hideMenu() {
        this.headbar.style.visibility = "hidden";
        this.hideAllEl();
    }
    showMenu() {
        this.headbar.style.visibility = "visible";
        //this.showAllEl();
    }
    showAllEl() {
        this.elArray.forEach(e => this.#showEl(e));
    }
    hideAllEl() {
        this.elArray.forEach(e => this.#hideEl(e));
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
        el.style.backgroundColor = "rgb(180, 171, 171)";
    }
    
}


const baseMenu = new dropMenu
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
const perfShapesMenu = new dropMenu
    (
        [{ text: "Square" }, { text: "Cirlce" }, { text: "Rect" }, { text: "Triange" }], //menu text
        document.getElementById("menuHolder"), //
        false, //hidden?
        10, //xoffset
        0,  ///yoffset
        50, //buttonWidth
        10, //buttonheight
        10, //textSize

    )

baseMenu.childs.push({ el: perfShapesMenu, button: baseMenu.elArray.find(e => e.id === "Perfect Shapes") });
