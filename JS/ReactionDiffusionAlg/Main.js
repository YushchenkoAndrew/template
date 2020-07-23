const W = 700;
const H = 700;

const step = 10;

let diffusion;

function setup() {
  createCanvas(W, H);

  diffusion = new Diffusion();
}

function draw() {
  background(0);

  diffusion.show();
}
