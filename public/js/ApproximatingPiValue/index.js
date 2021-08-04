let SIZE;
let RECT_SIZE;

let canvas;
let dots = 0;
let dotsInCircle = 0;

function setup() {
  // SIZE = window.innerWidth < 700 ? window.innerWidth : 700;
  SIZE = window.innerWidth < 768 ? 500 : 700;
  SIZE = window.innerWidth < 560 ? 400 : SIZE;
  SIZE = window.innerWidth < 400 ? 300 : SIZE;
  RECT_SIZE = SIZE / 1.75;
  canvas = createCanvas(SIZE, SIZE);
  canvas.parent(document.getElementById("CanvasContainer0"));

  background(0);
}

function addDots() {
  for (let i = 0; i < 1000; i++) {
    let x = random(-RECT_SIZE / 2, RECT_SIZE / 2);
    let y = random(-RECT_SIZE / 2, RECT_SIZE / 2);

    if (abs(x) != RECT_SIZE / 2 || abs(y) != RECT_SIZE / 2) dots++;

    noStroke();
    fill(150, 150, 150);
    ellipse(Math.floor(x), Math.floor(y), 2, 2);

    if (abs(dist(0, 0, x, y)) < RECT_SIZE / 2) dotsInCircle++;
  }
}

window.addEventListener(
  "resize",
  (event) => {
    SIZE = window.innerWidth < 768 ? 500 : 700;
    SIZE = window.innerWidth < 560 ? 400 : SIZE;
    SIZE = window.innerWidth < 400 ? 300 : SIZE;
    RECT_SIZE = SIZE / 1.75;
    canvas.resize(SIZE, SIZE);

    background(0);
  },
  true
);

function draw() {
  translate(SIZE / 2, SIZE / 2);

  noFill();
  stroke(255);

  ellipse(0, 0, RECT_SIZE, RECT_SIZE);
  rect(-RECT_SIZE / 2, -RECT_SIZE / 2, RECT_SIZE, RECT_SIZE);

  let { x, y } = canvas.position();

  if (
    mouseIsPressed &&
    mouseX >= x &&
    mouseX < x + canvas.width &&
    mouseY >= y &&
    mouseY < y + canvas.height
  )
    addDots();

  noStroke();
  fill(0);
  rect(-SIZE / 2, RECT_SIZE / 2 + 2, SIZE, (SIZE - RECT_SIZE) / 2);
  textSize(32);

  fill(255);
  text(
    dots ? ((4 * dotsInCircle) / dots).toFixed(6) : "0.000000",
    -RECT_SIZE / 6.6,
    RECT_SIZE / 1.3
  );
}
