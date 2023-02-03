import { 
  Shape 
} from './script.js';

import { 
  shapeArea 
} from './math.js';

const makeNSidedPolygon = (n, center, radius, startingVector) => {
  const vertices = [];
  for (let i = 1; i <= n; i++) {
    vertices.push({ x: center.x + Math.cos(( 2 * Math.PI / n ) * i) * radius, y: center.y + Math.sin(( 2 * Math.PI / n) * i) * radius});
  };
  console.log(vertices);
  return new Shape(startingVector, vertices, shapeArea(vertices) * document.getElementById('density').value);
};

export {
  makeNSidedPolygon
}