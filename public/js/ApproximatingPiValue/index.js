let canvas;
let REACT_SIZE = 400;

let dots = [];
let dotsInCircle = 0;

function setup() {
  canvas = createCanvas(700, 700);

  background(0);
  translate(350, 350);

  noFill();
  stroke(255);

  ellipse(0, 0, REACT_SIZE, REACT_SIZE);
  rect(-REACT_SIZE / 2, -REACT_SIZE / 2, REACT_SIZE, REACT_SIZE);
}

function addDots() {
  for (let i = 0; i < 1000; i++) {
    let x = random(-REACT_SIZE / 2, REACT_SIZE / 2);
    let y = random(-REACT_SIZE / 2, REACT_SIZE / 2);

    if (abs(x) != REACT_SIZE / 2 || abs(y) != REACT_SIZE / 2) dots.push([x, y]);

    noStroke();
    fill(150, 150, 150);
    ellipse(Math.floor(x), Math.floor(y), 2, 2);

    if (abs(dist(0, 0, x, y)) < REACT_SIZE / 2) dotsInCircle++;
  }
}

function draw() {
  translate(350, 350);

  noStroke();
  fill(0);
  rect(-60, 250, 150, 52);

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
    text(((4 * dotsInCircle) / dots.length).toFixed(6), -60, 300);
}
