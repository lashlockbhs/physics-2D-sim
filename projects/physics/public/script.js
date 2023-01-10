import { setCanvas, drawFilledCircle, clear, width, height, animate, now, registerOnKeyDown, registerOnclick, drawFilledRect, drawLine } from './graphics.js';
import { add2Vectors, vectorMultiply, addNumVectors, sigma, pi, degToRad, radToDeg, mean, geoMean, twoPointAngle, distance, getAcceleration, getVelocity, vector, twoPointXYDif } from './math.js';

const canvas = document.getElementById('screen');
setCanvas(canvas)

//returns points that are 1 or less pixels away from eachother
const closePoints = (ar1, ar2) => ar1.filter(e => ar2.find(e2 => distance(e, e2) <= 1) != undefined ? true : false)

//returns an array of objects that have a x, y point of collison and the shapes involved
const collisions = (shapes) => {
  const collisions = []
  for (let s1 = 0; s1 < shapes.length; s1++) {
    for (let s2 = s1 + 1; s2 < shapes.length; s2++) {

      const s1Bounds = shapes[s1].getBoundOfObject()
      const s2Bounds = shapes[s2].getBoundOfObject()

      collisions.push({ "points": closePoints(s1Bounds, s2Bounds), "s1": shapes[s1], "s2": shapes[s2] })
    }
  }
  return collisions;
}

const getBoundCenter = (points) => {
  const pts = points.concat(points[0])
  const area = (sigma(0, pts.length - 2, i => (pts[i].x * pts[i + 1].y) - (pts[i + 1].x * pts[i].y))) / 2
  const x = (sigma(0, pts.length - 2, i => (pts[i].x + pts[i + 1].x) * ((pts[i].x * pts[i + 1].y) - (pts[i + 1].x * pts[i].y)))) / (6 * area)
  const y = (sigma(0, pts.length - 2, i => (pts[i].y + pts[i + 1].y) * ((pts[i].x * pts[i + 1].y) - (pts[i + 1].x * pts[i].y)))) / (6 * area)
  return ({ x, y })
}

//from web
const rotate = (cx, cy, x, y, angle) => {
  let radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}

const drawPoints = (ar, color) => {
  for (const point of ar) {
    drawLine(point.x, point.y, point.x + 1, point.y + 1, color, 1)
  }
}

class Shape {
  constructor(mass, actingForces, vertices) {
    //this.startingX = vertices[0].x //for draw
    //this.startingY = vertices[0].y //for draw
    this.sides = createSides(vertices)
    this.vertices = vertices
    this.mass = mass
    this.centerX = getBoundCenter(vertices).x
    this.centerY = getBoundCenter(vertices).y
    this.rotation = 0
    this.actingForce = [addNumVectors(actingForces)]
    this.vertDifs = []//the pos of the verticies relitive to the center, in replacment of the "sides" athgorithm
    for (const vert of vertices) {
      this.vertDifs.push(twoPointXYDif(vert, { x: this.centerX, y: this.centerY }))
    }
  }
  //should be called everytime you update this opjects varibles outside of the class
  updateProperties() {

    console.log(this.vertices)
    this.vertices.forEach((e, i) => e = { x: this.centerX + this.vertDifs[i].xDif, y: this.centerY + this.vertDifs[i].yDif })

    this.vertices.forEach((e) => {
      console.log(e)
      const rotateCords = rotate(this.centerX, this.centerY, e.x, e.y, this.rotation)
      e.x = rotateCords[0]
      e.y = rotateCords[1]
    })
    console.log(this.vertices)
  }
  drawShape() {
    drawPoints(this.vertices)
    for (let i = 0; i < vertices.length; i++) {

      if (i + 1 === this.vertices.length) {
        drawLine(this.vertices[i].x, this.vertices[i].y, this.vertices[0].x, this.vertices[0].y, 'black', 1)
      }
      else {
        drawLine(this.vertices[i].x, this.vertices[i].y, this.vertices[i + 1].x, this.vertices[i + 1].y, 'black', 1)
      }
    }
  }
  getBoundOfObject() {
    let currX = this.startingY;
    let currY = this.startingX;
    let array = []
    for (let i = 0; i < this.sides.length; i++) {
      let startPoint = rotate(this.centerX, this.centerY, currX, currY, this.rotation)
      let endPoint = rotate(this.centerX, this.centerY, currX + this.sides[i].xAdd, currY + this.sides[i].yAdd, this.rotation);
      let numOfSidePixels = Math.round(Math.sqrt(((startPoint[0] - endPoint[0]) ** 2) + ((startPoint[1] - endPoint[1]) ** 2)));

      drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1])

      let xPerPix = (endPoint[0] - startPoint[0]) / numOfSidePixels
      let yPerPix = (endPoint[1] - startPoint[1]) / numOfSidePixels

      for (let n = 0; n < numOfSidePixels; n++) {
        array.push({ "x": startPoint[0] + n * xPerPix, "y": startPoint[1] + n * yPerPix })
      }

      currX = currX + this.sides[i].xAdd;
      currY = currY + this.sides[i].yAdd;
    }
    return array
  }
}

const createSides = (array) => {
  const returnArray = []
  for (let v = 0; v < array.length - 1; v++) {
    returnArray.push({ xAdd: array[v + 1].x - array[v].x, yAdd: array[v + 1].y - array[v].y })
  }
  returnArray.push({ xAdd: array[0].x - array[array.length - 1].x, yAdd: array[0].y - array[array.length - 1].y })
  return returnArray
}


const objArray = []
let vertices = []
let animateStart = false;

registerOnclick((x, y) => {
  if (!animateStart) {
    drawFilledCircle(x, y, 1.7, 'black')
    vertices.push({ x, y })
  }
})

registerOnKeyDown(() => {
  if (!animateStart) {
    objArray.push(new Shape(10, [vector(0, 0)], vertices))
    objArray[objArray.length - 1].drawShape()
    console.log(objArray)
    drawFilledCircle(objArray[objArray.length - 1].centerX, objArray[objArray.length - 1].centerY, 2.5, "red")
    vertices = []
    animateStart = objArray.length >= 3 ? true : false
  }
})
if(animateStart){
  console.log("e")
  for (const shape of objArray) {
    shape.updateProperties()
    shape.rotation = 20;
    shape.updateProperties()

    drawFilledCircle(shape.centerX, shape.centerY, 2.5, "red")
    shape.drawShape();

  }
}
/*
let next = 0;
let countFrame = 0;
const drawFrame = (time) => {
  if ((time > next) && animateStart) {
    clear();
    for (const shape of objArray) {
      shape.rotation = 20;
      shape.updateProperties()

      drawFilledCircle(shape.centerX, shape.centerY, 2.5, "red")
      shape.drawShape();

      next += 1;
      countFrame++;
    }
  }
}

animate(drawFrame)
export {
  Shape,
  collisions,
  getBoundCenter,
}
*/