
import {
  setCanvas,
  drawFilledCircle,
  clear,
  width,
  height,
  animate,
  now,
  registerOnKeyDown,
  registerOnclick,
  drawFilledRect,
  drawLine,
  drawText,
  drawCircle,
} from './graphics.js';

import {
  add2Vectors,
  vectorMultiply,
  addNumVectors,
  sigma,
  pi,
  degToRad,
  radToDeg,
  mean,
  geoMean,
  twoPointAngle,
  distance,
  shapeArea,
  vector,
  twoPointXYDif,
} from './math.js';

const canvas = document.getElementById('screen');
setCanvas(canvas);


//global
let Theme = { background: 'black', draw: 'white', accents: 'red' }
let Density = document.getElementById('density').value // measured in kg/pixel, redefine in REPL
drawFilledRect(0, 0, width, height, Theme.background)
const ObjArray = []
let CircleCoords = []
let animateStart = false
const secPerFrame = 2

//object
const evalCollisions = (object) => {
  const returnObject = object;
  const collisions = [];
  let index = 0;
  for (const element of ObjArray) {
    const distance = Math.hypot(Math.abs(object.x - element.x), Math.abs(object.y - element.y))
    if ((object.radius + element.radius > distance) && (distance != 0)) {
      collisions.push({ source: element, index: index, angle: twoPointAngle(element, object) })
    }
    index++
  }
  if (collisions.length > 0) console.log(collisions)
  let col = 0
  for (const element of collisions) {
    returnObject.x = mean([object.x, element.source.x])
    returnObject.y = mean([object.y, element.source.y])
    returnObject.area += element.source.area
    returnObject.radius = Math.sqrt(object.area) / Math.PI
    returnObject.force.concat(element.force, element.index - col)
    col++
  }
  return returnObject
}

class Shape {
  constructor(radius, activeForce, x, y) {
    this.area = (Math.PI * radius) ** 2
    this.mass = this.area * Density
    this.x = x
    this.y = y
    this.force = activeForce
    this.currAcc = this.getAcceleration(secPerFrame)
    this.currVelocity = this.getVelocity(secPerFrame)
    this.radius = radius
  }

  draw() {
    drawCircle(this.x, this.y, this.radius, Theme.draw, 1)
    drawFilledCircle(this.x, this.y, 2, Theme.accents)
    drawText(this.mass.toString(), this.x, this.y - 7 - this.radius, 'black', 10)
  }
  getAcceleration(appliedTime) {
    return (addNumVectors(this.force).magnitude / this.mass) * appliedTime;
  };

  getVelocity(appliedTime) {
    this.getAcceleration(addNumVectors(this.force).magnitude, this.mass, appliedTime) * secPerFrame;
  }
  getDisplacement(appliedTime) {
    const h = this.getVelocity(addNumVectors(this.force).magnitude, this.mass, appliedTime, secPerFrame) * secPerFrame
    const p = Math.sin(addNumVectors(this.force).angle) * h
    const b = Math.sqrt(h ** 2 - p ** 2)
    return { xChange: Math.round(b * 10) / 10, yChange: Math.round(p * 10) / 10 }
  }

}

const initDraw = (coordArray) => {
  if (coordArray.length == 3) {
    const radius = Math.hypot(Math.abs(coordArray[0].x - coordArray[1].x), Math.abs(coordArray[0].y - coordArray[1].y))
    const force = [vector(
      twoPointAngle(coordArray[0], coordArray[2]),
      Math.hypot(twoPointXYDif(coordArray[0], coordArray[2]).xDif, twoPointXYDif(coordArray[0], coordArray[2]).yDif) / 10,
    )]
    drawCircle(coordArray[0].x, coordArray[0].y, radius, Theme.draw)
    drawLine(coordArray[0].x, coordArray[0].y, coordArray[2].x, coordArray[2].y, 1, 'Theme.draw')
    drawText((2 * Math.PI * radius).toString(), coordArray[0].x, coordArray[0].y - 7 - 2 * Math.PI * radius, 'black', 10)
    ObjArray.push(new Shape(radius, force, CircleCoords[0].x, CircleCoords[0].y))
    CircleCoords = []
  }
}

registerOnclick((x, y) => {
  drawFilledCircle(x, y, 2, CircleCoords.length < 1 ? Theme.accents : Theme.draw)
  CircleCoords.push({ x, y })
  initDraw(CircleCoords)
})
registerOnKeyDown((k) => {
  console.log(k)
  if (k === 'Enter') {
    animateStart = !animateStart
  } else if (k === 'c') {
    ObjArray = []
  }
})

let next = 0
let countFrame = 0
const nextFrame = (time) => {
  if (time > next && animateStart) {
    CircleCoords = []
    clear()
    drawFilledRect(0, 0, width, height, Theme.background)
    let index = 0
    //console.log(ObjArray)
    for (let element of ObjArray) {
      ObjArray[index] = evalCollisions(element)
    }
   
    for (const element of ObjArray){
      //i don't know what apply time should be -- This is done after the 1st one so that all of the things can get the collisions
      element.force = [addNumVectors(element.force)]
      element.currAcc += element.getAcceleration(secPerFrame)
      element.currVelocity += element.getVelocity(secPerFrame)
      element.x = element.getDisplacement(secPerFrame).x
      element.y = element.getDisplacement(secPerFrame).y 
      element.draw()
      index++
    }
    console.log(ObjArray)
    time += secPerFrame
    countFrame++
  }
}

animate(nextFrame)