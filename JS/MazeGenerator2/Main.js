const W = 700;
const H = 700;

const step = 20;

let gen;

let highlight = true;

function setup() {
  createCanvas(W, H);

  gen = new Generator(new Chamber(0, 0, W, H));

  // while (gen.update());
  console.log(gen);
}

function mouseClicked() {
  highlight ^= true;
}

function draw() {
  background(0);

  gen.update();
  gen.show();
}
