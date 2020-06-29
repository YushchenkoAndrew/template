const W = 700;
const H = 700;

const step = 50;

let gen;

function setup() {
  createCanvas(W, H);

  gen = new Generator(new Chamber(0, 0, W, H));

  gen.update();
  //   frameRate(1);

  console.log(gen);
}

function draw() {
  background(0);

  gen.show();
}
