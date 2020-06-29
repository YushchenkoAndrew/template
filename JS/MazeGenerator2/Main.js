const W = 700;
const H = 700;

const step = 50;

let gen;

function setup() {
  createCanvas(W, H);

  gen = new Generator(new Chamber(0, 0, W, H));

  //   frameRate(1);

  console.log(gen);
}

function mouseClicked() {
  gen.update();
}

function draw() {
  background(0);

  gen.show();
}
