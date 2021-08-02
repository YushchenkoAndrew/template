let SIZE;
let RECT_SIZE;

let canvas;
let dots = [];
let dotsInCircle = 0;

function setup() {
  SIZE = window.innerWidth < 700 ? window.innerWidth : 700;
  RECT_SIZE = SIZE / 1.75;
  canvas = createCanvas(SIZE, SIZE);
  canvas.parent(document.getElementById("CanvasContainer0"));

  background(0);
  translate(SIZE / 2, SIZE / 2);

  noFill();
  stroke(255);

  ellipse(0, 0, RECT_SIZE, RECT_SIZE);
  rect(-RECT_SIZE / 2, -RECT_SIZE / 2, RECT_SIZE, RECT_SIZE);
}

function addDots() {
  for (let i = 0; i < 1000; i++) {
    let x = random(-RECT_SIZE / 2, RECT_SIZE / 2);
    let y = random(-RECT_SIZE / 2, RECT_SIZE / 2);

    if (abs(x) != RECT_SIZE / 2 || abs(y) != RECT_SIZE / 2) dots.push([x, y]);

    noStroke();
    fill(150, 150, 150);
    ellipse(Math.floor(x), Math.floor(y), 2, 2);

    if (abs(dist(0, 0, x, y)) < RECT_SIZE / 2) dotsInCircle++;
  }
}

function resizeCanvas() {
  SIZE = window.innerWidth < 700 ? window.innerWidth : 700;
  RECT_SIZE = SIZE / 1.75;
  canvas.resize(SIZE, SIZE);
}

function draw() {
  translate(SIZE / 2, SIZE / 2);

  noStroke();
  fill(0);
  rect(-SIZE / 2, RECT_SIZE / 2 + 2, SIZE, (SIZE - RECT_SIZE) / 2);

  let { x, y } = canvas.position();

  if (
    mouseIsPressed &&
    mouseX >= x &&
    mouseX < x + canvas.width &&
    mouseY >= y &&
    mouseY < y + canvas.height
  )
    addDots();

  textSize(32);
  fill(255);
  if (dots.length != 0)
    text(
      ((4 * dotsInCircle) / dots.length).toFixed(6),
      -RECT_SIZE / 6.6,
      RECT_SIZE / 1.3
    );
}
