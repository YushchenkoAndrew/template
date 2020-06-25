const W = window.innerWidth;
const H = window.innerHeight;

let f;

let behavior;

function preload() {
  f = loadFont("Fonts/Lato-BlackItalic.ttf");
}

function setup() {
  createCanvas(W, H);

  fill(255);
  //   text("Test", 150, 400);

  let points = f.textToPoints("Test", 150, 400, 200);

  behavior = new SteeringBehavior(points);
}

function draw() {
  background(0, 70);

  behavior.show();
}
