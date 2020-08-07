const W = 700;
const H = 700;

const step = 50;
const R = 5;

// Customs values
let showGrid = true;
let showValue = true;
let showBalls = true;
let mouseControl = false;

let metaballs = [];
let marchingSquares;

function setup() {
  createCanvas(W, H);

  // for (let i = 0; i < 8; i++) metaballs.push(new Metaball());

  marchingSquares = new MarchingSquares();

  console.log("Custom parameters:");
  console.log(`\tshowGrid = ${!showGrid}`);
  console.log(`\tshowValue = ${!showValue}`);
  console.log(`\tshowBalls = ${!showBalls}`);
  console.log(`\tmouseControl = ${!mouseControl}`);
}

function draw() {
  background(0);

  marchingSquares.show();

  if (mouseControl) marchingSquares.metaballs[0].pos = createVector(mouseX, mouseY);

  // for (let i in metaballs) {
  // metaballs[i].show();
  // metaballs[i].update();
  // }
}
