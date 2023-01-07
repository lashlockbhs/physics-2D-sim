//vector manipulation
const vector = (angle, magnitude) => {
  return ({ angle: angle * Math.PI / 180, magnitude })
}

const add2Vectors = (a) => {
  const x1 = Math.cos(a[0].angle) * a[0].magnitude
  const x2 = Math.cos(a[1].angle) * a[1].magnitude
  const y1 = Math.sin(a[0].angle) * a[0].magnitude
  const y2 = Math.sin(a[1].angle) * a[1].magnitude
  const angle = Math.atan2(y1 + y2, x1 + x2)
  const mag = Math.sqrt((x1 + x2) ** 2 + (y1 + y2) ** 2)
  return ({ angle, magnitude: mag })
}

const vectorMultiply = (o, n) => {
   if (n >= 0) {
    return ({ angle: o.angle, magnitude: o.magnitude * n })
   } else {
    return ({ angle: o.angle + Math.PI, magnitude: o.magnitude * -n })
  }
}

const addNumVectors = (a) => {
  return a.reduce((acc, x) => add2Vectors([acc, x]), vector(0, 0))
}

//general math functions
const sigma = (start, end, funct) => {
  const sum = 0
  for (let i = start; i <= end; i++) {
    sum += funct(i)
  }
  return sum  
}

const pi = (start, end, funct) => {
  let product = 1
  for (let i = start; i <= end; i++) {
    product *= funct(i)
  }
  return product
}

