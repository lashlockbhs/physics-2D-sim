
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
  twoPointDistance,
  shapeArea,
  vector,
  twoPointXYDif,
  twoShapeGrav,
  findDerivative,
} from './math.js';

const canvas = document.getElementById('screen');
setCanvas(canvas);


//global
let Theme = { background: 'black', draw: 'white', accents: 'red' }
const Density = document.getElementById('density').value
drawFilledRect(0, 0, width, height, Theme.background)
let ObjArray = []
let CircleCoords = []
let animateStart = false
const secPerFrame = 1

//object
const evalGravity = (object) => {
  const effects = [];
  let index = 0;
  for (const element of ObjArray) {
    const distance = twoPointDistance({ x: object.x, y: object.y }, { x: element.x, y: element.y })
    if ((object.radius + element.radius < distance) && (distance != 0)) {
      effects.push({ source: element, index: index, distance, angle: twoPointAngle({ x: object.x, y: object.y }, { x: element.x, y: element.y }) })
    }
    index++
  }

  const totalForce = object.force
  for (const element of effects) {
    totalForce.push(vector(element.angle, twoShapeGrav(object, element)))
  }
  return addNumVectors(object.force.concat(totalForce))
}

const evalCollisions = (object) => {
  const returnObject = object;
  const collisions = [];
  let index = 0;
  for (const element of ObjArray) {
    const distance = twoPointDistance(object, element)
    if ((object.radius + element.radius < distance) && (distance != 0)) {
      collisions.push({ source: element, index: index, angle: twoPointAngle(element, object) })
    }
    index++
  }
  if (collisions.length > 0) console.log('collsions', collisions)
  for (const element of collisions) {
    // help!
  }
  return returnObject
}

class Shape {
  constructor(radius, activeVelocity, x, y) {
    this.area = (Math.PI * radius) ** 2
    this.mass = this.area * Density
    this.x = x
    this.y = y
    this.force = [vector(0, 0)]
    this.currAcc = vector(0, 0)
    this.currVelocity = activeVelocity
    this.radius = radius
  }

  draw() {
    drawCircle(this.x, this.y, this.radius, Theme.draw, 1)
    drawFilledCircle(this.x, this.y, 2, Theme.accents)
    drawText(this.mass.toString(), this.x, this.y - 7 - this.radius, 'black', 10)
  }


/*
  getAccelfromVelo() {
    const angle = this.currVelocity.angle;
    const currVeloMagnitude = this.currVelocity.magnitude;
    const lastVeloMagnitude = this.lastVelocity.magnitude;
    if (currVeloMagnitude !== lastVeloMagnitude) {
      const derivative = findDerivative([{ constant: Math.abs(lastVeloMagnitude - currVeloMagnitude), degree: 1 }]);
      return { angle, magnitude: derivative * secPerFrame };
    } else {
      return { angle, magnitude: 0 };
    };
  }
*/
  getAccelfromForce() {
    return vector(this.actingForce[0].angle, (this.actingForce[0].magnitude / this.mass) * secPerFrame);
  };

  getDisplacement() {
    const magnitude = this.currVelocity.magnitude * secPerFrame
    const xChange = Math.cos(this.currVelocity.angle) * magnitude;
    const yChange = Math.sin(this.currVelocity.angle) * magnitude;
    return { xChange, yChange };
  };

};

const initDraw = (coordArray) => {
  if (coordArray.length === 3) {
    const radius = Math.hypot(Math.abs(coordArray[0].x - coordArray[1].x), Math.abs(coordArray[0].y - coordArray[1].y))
    const velocity = [vector(
      twoPointAngle(coordArray[0], coordArray[2]),
      twoPointDistance(coordArray[0], coordArray[2]),
    )]
    drawCircle(coordArray[0].x, coordArray[0].y, radius, Theme.draw)
    drawLine(coordArray[0].x, coordArray[0].y, coordArray[2].x, coordArray[2].y, 1, 'Theme.draw')
    console.log(CircleCoords)
    ObjArray.push(new Shape(radius, velocity, CircleCoords[0].x, CircleCoords[0].y))
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
  } else if (k === 'k') {
    //kill
    clear()
    ObjArray = []
    animateStart = false
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
      index++
    }

    for (const element of ObjArray) {
      element.force = [evalGravity(element)]
      element.force = [addNumVectors(element.force)]
      element.currAcc = add2Vectors(element.getAccelfromForce, element.currAcc)
      element.currVelocity = add2Vectors(element.currVelocity, vector(element.currAcc.angle, element.currAcc/secPerFrame))
      element.x += element.getDisplacement().xChange
      element.y += element.getDisplacement().yChange
      element.draw()
    }
    console.log(ObjArray)
    time += secPerFrame
    countFrame++
  }
}

animate(nextFrame)