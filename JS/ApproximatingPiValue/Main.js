let r = 400;

let dots = [];
let dotsInCircle = 0;

function setup() {
  createCanvas(700, 700);

  background(0);
  translate(350, 350);

  noFill();
  stroke(255);

  ellipse(0, 0, r, r);
  rect(-r / 2, -r / 2, r, r);
}

function addDots() {
  for (let i = 0; i < 10000; i++) {
    let x = random(-r / 2, r / 2);
    let y = random(-r / 2, r / 2);

    if (abs(x) != r / 2 || abs(y) != r / 2) dots.push([x, y]);

    noStroke();
    fill(255, 255, 255, 10);
    ellipse(Math.floor(x), Math.floor(y), 2, 2);

    if (abs(dist(0, 0, x, y)) < r / 2) dotsInCircle++;
  }
}

function mousePressed() {
  return new Promise(addDots);
}

function draw() {
  translate(350, 350);

  noStroke();
  fill(0);
  rect(-60, 250, 150, 52);

  textSize(32);
  fill(255);
  if (dots.length != 0) text(((4 * dotsInCircle) / dots.length).toFixed(6), -60, 300);
}
