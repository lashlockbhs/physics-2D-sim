import { setCanvas, drawFilledCircle, clear, width, height, animate, now } from './graphics.js';

const drawBall = (b) => {
    drawFilledCircle(b.x, b.y, b.size, 'blue');
};

let lastFrame = now();

const updatePosition = (b, t) => {
    maybeBounce(b);
    b.x = clamp(b.x + b.dx * (t - lastFrame), 0, width);
    b.y = clamp(b.y + b.dy * (t - lastFrame), 0, height);
    lastFrame = t;
};

const distance = (a, b) => Math.abs(a - b);

const clamp = (n, min, max) => n < min ? min : n > max ? max : n;

const maybeBounce = (b) => {
    if (Math.min(distance(b.x, 0), distance(b.x, width)) < b.size ) {
        b.dx *= -1;
    }
    if (Math.min(distance(b.y, 0), distance(b.y, height)) < b.size) {
        b.dy *= -1;
    }
};

const launch = (b, speed, direction) => {
    b.dx = Math.cos(direction) * speed;
    b.dy = Math.sin(direction) * speed;
}

// This has to come early so width and height are set before we use them.
setCanvas(document.getElementById('screen'));

let ball = {
    x: width / 2,
    y: height / 2,
    size: 10,
    dx: 0,
    dy: 0,
};

launch(ball, 1, Math.random() * Math.PI * 2);

animate((t) => {
  updatePosition(ball, t);
  clear();
  drawBall(ball);
});
