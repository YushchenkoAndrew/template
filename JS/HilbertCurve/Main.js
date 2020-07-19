const W = 700;
const H = W;

let order = 1;
let curve;

// Custom variable
let showNum = 0;

function setup() {
  createCanvas(W, H);

  // Change Color mode for Coloring in different colors
  colorMode(HSB, 2 * PI, 255, 255);

  curve = new HilbertCurve(order);

  console.log("Click Mouse for increase order for Hilbert Curve");
  console.log("Set 'showNum = true' for showing number of each Node");

  while (!curve.update());
}

function mouseClicked() {
  curve.setOrder(++order);
}

function draw() {
  background(0);

  curve.update();
  curve.show(showNum);
}
