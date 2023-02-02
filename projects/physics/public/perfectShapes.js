import {
  setCanvas,
  drawLine,
  drawCircle,
  drawRect,
  drawTriangle,
  drawFilledCircle,
  drawFilledRect,
  drawFilledTriangle,
  drawRoundedRect,
  drawFilledRoundedRect,
  drawText,
  clear,
  width,
  height,
  now,
  animate,
  registerOnclick,
  registerOnKeyDown,
} from './graphics.js';

import { Shape } from './script.js';

import { shapeArea } from './math.js';

const drawPerfectCircle = (o1, radius, vector) => {
  drawCircle(o1.x, o1.y, radius, 'black', 1);
};

const drawEquilateralTriangle = (o1, radius, vector) => {
  new Shape(
    vector,
    [
      { x: o1.x, y: o1.y + radius },
      { x: o1.x - (Math.sqrt(3) * radius) / 2, y: o1.y - radius / 2 },
      { x: o1.x + (Math.sqrt(3) * radius) / 2, y: o1.y - radius / 2 },
    ],
    shapeArea * document.getElementById('density').value,
  );
};

const drawRegularPerfectQuadrilateral = (o1, radius, vector) => {
  new Shape(vector, [
    { x: o1.x + (Math.sqrt(2) / 2) * radius, y: o1.y + (Math.sqrt(2) / 2) * radius },
    { x: o1.x + (Math.sqrt(2) / 2) * radius, y: o1.y - (Math.sqrt(2) / 2) * radius },
    { x: o1.x - (Math.sqrt(2) / 2) * radius, y: o1.y - (Math.sqrt(2) / 2) * radius },
    { x: o1.x - (Math.sqrt(2) / 2) * radius, y: o1.y + (Math.sqrt(2) / 2) * radius },
  ]);
};
