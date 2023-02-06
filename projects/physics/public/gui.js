
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
        this.windowObject;
        this.window;
    }
    #createButton(displayTxt) {
        const div = document.createElement("div");
        div.setAttribute("id", displayTxt);
        div.style.width = this.boxWidth + "px";
        div.style.height = this.boxHeight + "px";
        let text = document.createTextNode(displayTxt);
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
    createElements() {
        //create button/option elements as divs
        for (let i = 0; i < this.options.length; i++) {
            this.#createButton(this.options[i].text);
        }
    }
    createHeadbar() {
        this.headbar = document.createElement("div");
        this.headbar.setAttribute("id", "headbar");
        this.headbar.setAttribute("dragable", "true");
        this.headbar.style.width = this.boxWidth + "px";
        this.headbar.style.height = 10 + "px";
        this.headbar.style.left = this.xOffset + "px";
        this.headbar.style.top = this.yOffset + "px";
        this.hidden ? this.headbar.style.visibility = "hidden" : this.headbar.style.display = "grid";
        this.headbar.onclick = (e) => {
            if (e.target === this.headbar && dragDone) {
                this.optionsHidden ? this.showAllEl() : this.hideAllEl()
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
            else {
                dragDone = true;
            }
        }
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0;
        let yOffset = 0;
        let dragDone = true;

        this.headbar.onmousedown = (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            document.onmousemove = whileDragging;
            document.onmouseup = (e) => { isDragging = false; document.onmousemove = null };
            isDragging = true;
        }
        this.headbar.onmouseup = (e) => {
            isDragging = false;
        };

        this.headbar.onmousemove = whileDragging;
        this.menuHolder.append(this.headbar);
    }
    createWindow(objects, width, height) {
        const window = document.createElement("div");
        this.window = window;
        window.style.top = 10 + "px";
        window.style.left = -1 + "px";
        window.style.visibility = "hidden";
        window.setAttribute("id", "window");
        for (let i = 0; i < objects.length; i++) {

            const div = document.createElement("div");
            div.setAttribute("id", objects[i].name);
            div.style.width = this.boxWidth + "px";
            div.style.height = this.boxHeight + "px";
            div.style.left = -1 + "px";

            div.style.fontSize = this.textSize + "px";
            div.append(document.createTextNode(objects[i].name + ": " + JSON.stringify(objects[i].value)));

            this.elArray.push(div);
            window.append(div);
        }
        this.headbar.append(window);

    }
    updateWindow(objects) {
        const divs = this.window.children
        for (let i = 0; i < divs.length; i++) {
            console.log(objects)
            const object = objects.find(e => e.name === divs[i].id);
            const textNode = divs[i].firstChild;
            textNode.nodeValue = object.name + ": " + JSON.stringify(object.value);
        }
    }
    updateMenu() {
        for (let i = 0; i < this.options.length; i++) {
            try {
                console.log("before: " + this.elArray[i].firstChild.nodeValue)
                this.elArray[i].firstChild.nodeValue = this.options[i].text;
                console.log("after: " + this.elArray[i].firstChild.nodeValue)
                console.log("--------")
            }
            catch {
                this.#createButton(this.options[i].text)
            }
        }
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
    refresh(el) {
        el.style.backgroundColor = "rgb(200, 192, 192)";
    }

}



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
baseMenu.createHeadbar();
baseMenu.createElements();
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

perfShapesMenu.createHeadbar();
perfShapesMenu.createElements();

const shapeMenu = new Menu
    (
        [], //menu text
        document.getElementById("menuHolder"),
        true, //hidden?
        -42, //xoffset
        0,  ///yoffset
        50, //buttonWidth
        10, //buttonheight
        10, //textSize

    )

shapeMenu.createHeadbar();
shapeMenu.createElements();
const shape1 = new Menu(
    null,
    document.getElementById("menuHolder"),
    true,
    0,
    0,
    200,
    10,
    10,
)
baseMenu.childs.push(
    { el: perfShapesMenu, button: baseMenu.elArray.find(e => e.id === "Perfect Shapes") },
    { el: shapeMenu, button: baseMenu.elArray.find(e => e.id === "Shapes") }
);

export {
    Menu,
    shapeMenu
}
