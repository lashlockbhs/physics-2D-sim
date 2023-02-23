
import {
  setCanvas,
  drawFilledCircle,
  clear,
  //width,
  //height,
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
const width = 100;
const height = 100;
const canvas = document.getElementById('screen');
setCanvas(canvas);

const rotate = (cx, cy, x, y, angle) => {
  let radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return [nx, ny];
};

const arSims = (a1, a2) => {
  const newAr = [];
  for (let i = 0; i < a1.length; i++) {
    for (let j = 0; j < a2.length; j++) {
      if (a1[i].source === a2[j].source) newAr.push(a1[i]);
    }
  }
  return newAr;
}


//global
let Theme = { background: 'black', draw: 'white', accents: 'red' }
drawFilledRect(0, 0, width, height, Theme.background)
let ObjArray = [];
let CircleCoords = [];
let animateStart = false
const msecPerFrame = 10

const grav = 0.005; //grav toward ground
const f = 0.50; //multiplied by vel to mimick friction

class Shape {
  constructor(radius, push, x, y, name) {

    this.area = (Math.PI * radius) ** 2;
    this.mass = this.area * document.getElementById('density').value;
    this.radius = radius;

    this.pCurr = { x, y };
    this.pOld = { x: x + push.xDif / 4, y: y + push.yDif / 4 };
  }

  draw() {
    drawCircle(this.pCurr.x, this.pCurr.y, this.radius, Theme.draw, 1)
    drawFilledCircle(this.pCurr.x, this.pCurr.y, 1, Theme.accents)
  }

  update() {

    const vx = (this.pCurr.x - this.pOld.x);
    const vy = (this.pCurr.y - this.pOld.y);

    this.pOld.x = this.pCurr.x;
    this.pOld.y = this.pCurr.y;

    this.pCurr.x += vx;
    this.pCurr.y += vy;
    this.pCurr.y += grav;

    this.sides(vx, vy);



  }
  sides(vx, vy) {
    const mvx = vx * f;
    const mvy = vy * f;
    if (this.pCurr.x + this.radius > width) {
      this.pCurr.x = width - this.radius;
      this.pOld.x = this.pCurr.x + mvx;
    }
    else if (this.pCurr.x - this.radius < 0) {
      this.pCurr.x = this.radius;
      this.pOld.x = this.pCurr.x + mvx;
    }

    if (this.pCurr.y + this.radius > height) {
      this.pCurr.y = height - this.radius;
      this.pOld.y = this.pCurr.y + mvy;
    }
    else if (this.pCurr.y - this.radius < 0) {
      this.pCurr.y = this.radius;
      this.pOld.y = this.pCurr.y + mvy;
    }

  }

};
const collisons = () => {
  for (let k = 0; k < ObjArray.length; k++) {
    const shape1 = ObjArray[k];
    for (let i = 0; i < ObjArray.length; i++) {
      const shape2 = ObjArray[i];
      const dist = twoPointDistance(shape1.pCurr, shape2.pCurr);
      const angle = twoPointAngle(shape1.pCurr, shape2.pCurr);
      const angle2 = twoPointAngle(shape2.pCurr, shape1.pCurr);

      if ((shape2.radius + shape1.radius > dist) && shape1 != shape2) {
        const overLap = (shape2.radius + shape1.radius) / 2 - dist;

        //b1.radius + b2.radius - dist
        shape1.pOld.x = shape1.pCurr.x;
        shape1.pOld.y = shape1.pCurr.y;

        shape2.pOld.x = shape2.pCurr.x;
        shape2.pOld.y = shape2.pCurr.y;

        shape1.pCurr.y += Math.sin(angle) * ((overLap +2) / 2) * (0.3);
        shape1.pCurr.x += Math.cos(angle) * ((overLap+2) / 2) * (0.3);
        shape2.pCurr.y += Math.sin(angle2) * ((overLap+2) / 2) * (0.3);
        shape2.pCurr.x += Math.cos(angle2) * ((overLap+2) / 2) * (0.3);

      }
    }
  }
}

const initDraw = (coordArray) => {
  if (coordArray.length === 3) {
    const radius = twoPointDistance(coordArray[0], coordArray[1]);
    const push = twoPointXYDif(coordArray[0], coordArray[1]);
    drawCircle(coordArray[0].x, coordArray[0].y, radius, Theme.draw)
    drawLine(coordArray[0].x, coordArray[0].y, coordArray[2].x, coordArray[2].y, 1, 'Theme.draw')
    ObjArray.push(new Shape(radius, push, CircleCoords[0].x, CircleCoords[0].y, ObjArray.length))
    CircleCoords = []
  }
}

registerOnclick((x, y) => {
  drawFilledCircle(x, y, 2, CircleCoords.length < 1 ? Theme.accents : Theme.draw)
  CircleCoords.push({ x, y })
  initDraw(CircleCoords)
})

registerOnKeyDown((k) => {
  if (k === 'Enter') {
    animateStart = !animateStart;
  } else if (k === 'k') {
    clear();
    drawFilledRect(0, 0, width, height, Theme.background);
    ObjArray = [];
    animateStart = false;
  }
})

let next = 0;
let nextSpawn = 0;
let spawnSpeed = 500;
let countFrame = 0;
const nextFrame = (time) => {
  if (time > next && animateStart) {
    clear();
    drawFilledRect(0, 0, width, height, Theme.background)

    for (const element of ObjArray) {
      for (let i = 0; i < 2; i++) {
        collisons();
      }
      element.update();
      element.draw();
    }
    next += msecPerFrame;
    countFrame++;
  }
  if(time > nextSpawn && animateStart){
    ObjArray.push(new Shape(3, twoPointXYDif({x : 0, y : Math.random()*100}, {x : 0, y : Math.random()*100}), Math.random()*50, height/2, "cirlce"))

    nextSpawn += spawnSpeed;
  }
}

animate(nextFrame);