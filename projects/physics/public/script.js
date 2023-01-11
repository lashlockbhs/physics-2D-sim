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
    this.sides = createSides(vertices)
    this.vertices = vertices
    this.vertStart = vertices
    this.mass = mass
    this.centerX = getBoundCenter(vertices).x
    this.centerY = getBoundCenter(vertices).y
    this.rotation = 0
    this.actingForce = [addNumVectors(actingForces)]
    this.vertDifs = []//the pos of the verticies relitive to the center, in replacment of the "sides" athgorithm
    for (const vert of this.vertices) {
      this.vertDifs.push(twoPointXYDif(vert, { x: this.centerX, y: this.centerY }))
    }
  }
  //should be called everytime you update this opjects varibles outside of the class
  updateProperties() {

    //in case of rotaion vertDifs needs to be redefined
    this.vertDifs = [];
    for (const vert of this.vertices) {
      this.vertDifs.push(twoPointXYDif(vert, { x: this.centerX, y: this.centerY }))
    }
    
    //calc vertices pos based on centroid
    this.vertices.forEach((e, i) => e = { x: this.centerX + this.vertDifs[i].xDif, y: this.centerY + this.vertDifs[i].yDif })

    //rotate vertices
    this.vertices = this.vertStart.map((e) => {
      const rotateCords = rotate(this.centerX, this.centerY, e.x, e.y, this.rotation)
      return {x : rotateCords[0], y : rotateCords[1]}
    })

    

  }
  drawShape() {
    for (let i = 0; i < this.vertices.length; i++) {
      if (i + 1 === this.vertices.length) {
        drawLine(this.vertices[i].x, this.vertices[i].y, this.vertices[0].x, this.vertices[0].y, 'black', 1)
      }
      else {
        drawLine(this.vertices[i].x, this.vertices[i].y, this.vertices[i + 1].x, this.vertices[i + 1].y, 'black', 1)
      }
    }
  }
  //if detail = 2 then num points 2x
  getBoundOfObject(detail) {
    let array = []
    for (let i = 0; i < this.vertices.length; i++) {
      let xAdd, yAdd, dist, numPoints

      //last side, must go to orgin vert
      if (i + 1 === this.vertices.length) {
        dist = distance(this.vertices[i], this.vertices[0]);
        numPoints = dist*detail

        xAdd = (this.vertices[0].x - this.vertices[i].x)/numPoints;
        yAdd = (this.vertices[0].y - this.vertices[i].y)/numPoints;
      }
      else {
        dist = distance(this.vertices[i], this.vertices[i+1]);
        numPoints = dist*detail

        xAdd = (this.vertices[i+1].x - this.vertices[i].x)/numPoints;
        yAdd = (this.vertices[i+1].y - this.vertices[i].y)/numPoints;
      }
      for(let j = 0; j < Math.floor(numPoints); j++){
        array.push({x : this.vertices[i].x+(xAdd*j), y : this.vertices[i].y+(yAdd*j)})
      }
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

let next = 0;
let countFrame = 0;
const drawFrame = (time) => {
  if ((time > next) && animateStart) {
    clear();
    for (const shape of objArray) {
      shape.centerX +=10
      shape.rotation = countFrame;
      shape.updateProperties();

      const shapeBounds  = shape.getBoundOfObject(1)

      drawFilledCircle(shape.centerX, shape.centerY, 2.5, "red")
      shape.drawShape();
      
      
      next += 10;
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
