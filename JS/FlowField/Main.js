const W = Math.floor(window.innerWidth / 10) * 10;
const H = Math.floor(window.innerHeight / 10) * 10;

const step = 10;

const particleSize = 2;
const VelLimit = 5.2;

// Custom variable
let showFlow = false;

let flow;

function setup() {
  const canvas = createCanvas(W, H);
  canvas.position(0, 0);

  console.log(`W = ${W} --- H = ${H}`);

  flow = new FlowField(2000);

  console.log("Set 'showFlow = true' for showing Vectors");

  background(255);
}

function mouseClicked() {
  background(255, 150);
}

function draw() {
  if (showFlow) background(255);

  flow.calcFlow();
  flow.show(showFlow);
}
