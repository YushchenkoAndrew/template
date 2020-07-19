const W = 700;
const H = 700;

const order = 8;
let curve;

function setup() {
  createCanvas(W, H);

  curve = new HilbertCurve(order);
}

function draw() {
  background(0);

  curve.show();
}
