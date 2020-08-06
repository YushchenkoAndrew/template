const W = 700;
const H = 700;

const step = 10;
let cave;

function setup() {
  createCanvas(W, H);

  cave = new MarchingSquares();
}

function draw() {
  background(0);

  cave.show();
}
