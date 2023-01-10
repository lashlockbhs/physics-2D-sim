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
  getAcceleration,
  getVelocity,
  getDisplacement,
  vector,
} from './math.js';

const canvas = document.getElementById('screen');
setCanvas(canvas);
const FPS = 12 // frames per second
//returns points that are 1 or less pixels away from eachother
const closePoints = (ar1, ar2) =>
  ar1.filter((e) => (ar2.find((e2) => distance(e, e2) <= 1) != undefined ? true : false));

//returns an array of objects that have a x, y point of collison and the shapes involved
const collisions = (shapes) => {
  const collisions = [];
  for (let s1 = 0; s1 < shapes.length; s1++) {
    for (let s2 = s1 + 1; s2 < shapes.length; s2++) {
      const s1Bounds = shapes[s1].getBoundOfObject();
      const s2Bounds = shapes[s2].getBoundOfObject();

      collisions.push({ points: closePoints(s1Bounds, s2Bounds), s1: shapes[s1], s2: shapes[s2] });
    }
  }
  return collisions;
};

const getBoundCenter = (arr) => {
  const findCentroid = (points) => {
    const pts = points.concat(points[0]);
    const area =
      sigma(0, pts.length - 2, (i) => pts[i].x * pts[i + 1].y - pts[i + 1].x * pts[i].y) / 2;
    const x =
      sigma(
        0,
        pts.length - 2,
        (i) => (pts[i].x + pts[i + 1].x) * (pts[i].x * pts[i + 1].y - pts[i + 1].x * pts[i].y),
      ) /
      (6 * area);
    const y =
      sigma(
        0,
        pts.length - 2,
        (i) => (pts[i].y + pts[i + 1].y) * (pts[i].x * pts[i + 1].y - pts[i + 1].x * pts[i].y),
      ) /
      (6 * area);
    return { x, y };
  };
  const returner = findCentroid(arr);
  return returner;
};
//from web
const rotate = (cx, cy, x, y, angle) => {
  let radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return [nx, ny];
};

class Shape {
  constructor(mass, actingForces, vertices) {
    this.startingX = vertices[0].x; //for draw
    this.startingY = vertices[0].y; //for draw
    this.sides = createSides(vertices);
    this.vertices = vertices;
    this.mass = mass;
    this.centerX = getBoundCenter(vertices).x;
    this.centerY = getBoundCenter(vertices).y;
    this.rotation = 0;
    this.actingForce = [addNumVectors(actingForces)];
    this.actingAcc = getAcceleration(addNumVectors(actingForces), mass, 1/FPS)
    this.actingVelocity = getVelocity(addNumVectors(actingForces), mass, 1/FPS, FPS)
  }
  drawShape() {
    let currX = this.startingX;
    let currY = this.startingY;

    for (let i = 0; i < this.sides.length; i++) {
      let startPoint = rotate(this.centerX, this.centerY, currX, currY, this.rotation);
      let endPoint = rotate(
        this.centerX,
        this.centerY,
        currX + this.sides[i].xAdd,
        currY + this.sides[i].yAdd,
        this.rotation,
      );
      drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1], 'black');
      currX = currX + this.sides[i].xAdd;
      currY = currY + this.sides[i].yAdd;
    }
  }
  getBoundOfObject() {
    let currX = this.startingY;
    let currY = this.startingX;
    let array = [];
    for (let i = 0; i < this.sides.length; i++) {
      let startPoint = rotate(this.centerX, this.centerY, currX, currY, this.rotation);
      let endPoint = rotate(
        this.centerX,
        this.centerY,
        currX + this.sides[i].xAdd,
        currY + this.sides[i].yAdd,
        this.rotation,
      );
      let numOfSidePixels = Math.round(
        Math.sqrt((startPoint[0] - endPoint[0]) ** 2 + (startPoint[1] - endPoint[1]) ** 2),
      );

      drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);

      let xPerPix = (endPoint[0] - startPoint[0]) / numOfSidePixels;
      let yPerPix = (endPoint[1] - startPoint[1]) / numOfSidePixels;

      for (let n = 0; n < numOfSidePixels; n++) {
        array.push({ x: startPoint[0] + n * xPerPix, y: startPoint[1] + n * yPerPix });
      }

      currX = currX + this.sides[i].xAdd;
      currY = currY + this.sides[i].yAdd;
    }
    return array;
  }
}

const createSides = (array) => {
  const returnArray = [];
  for (let v = 0; v < array.length - 1; v++) {
    returnArray.push({ xAdd: array[v + 1].x - array[v].x, yAdd: array[v + 1].y - array[v].y });
  }
  returnArray.push({
    xAdd: array[0].x - array[array.length - 1].x,
    yAdd: array[0].y - array[array.length - 1].y,
  });
  return returnArray;
};

const objArray = [];
let vertices = [];
let animateStart = false;

registerOnclick((x, y) => {
  if (!animateStart) {
    drawFilledCircle(x, y, 1.7, 'black');
    vertices.push({ x, y });
  }
});

registerOnKeyDown(() => {
  if (!animateStart) {
    objArray.push(new Shape(10, [vector(0, 0)], vertices));
    objArray[objArray.length - 1].drawShape();
    drawFilledCircle(
      objArray[objArray.length - 1].centerX,
      objArray[objArray.length - 1].centerY,
      2.5,
      'red',
    );
    vertices = [];
    animateStart = objArray.length >= 3 ? true : false;
  }
});
console.log('e');

let next = 0;
let countFrame = 0;
const drawFrame = (time) => {
  if (time > next && animateStart) {
    clear();
    for (const shape of objArray) {
      drawFilledCircle(shape.centerX, shape.centerY, 2.5, 'red');
      shape.drawShape();
      shape.rotation = countFrame;
      next += 1;
      countFrame++;
    }
  }
};

animate(drawFrame);
