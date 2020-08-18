const H = window.innerHeight - 58;
const W = window.innerWidth;
let FRAME;

const offset = 12;
const ANGLE = (Math.PI * 5) / 6;

let flockSimulation;

function setup() {
  createCanvas(W, H);
  FRAME = new Rectangle(0, 0, W, H);

  flockSimulation = new Flock(200);
}

function draw() {
  background(0);

  flockSimulation.update();
  flockSimulation.show();
}
