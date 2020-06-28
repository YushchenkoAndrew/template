const W = 700;
const H = 700;

const step = 20;

let gen;

function setup() {
  createCanvas(W, H);

  gen = new Generator();

  // frameRate(5);
}

function draw() {
  background(0);

  gen.move();
  gen.show();
}
