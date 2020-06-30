const W = 700;
const H = 700;

const len = 300;
let angle = 0;

let sponge;

function setup() {
  createCanvas(W, H, WEBGL);

  sponge = new Square(0, 0, 0, len);
}

function mouseClicked() {
  sponge.update();
}

function draw() {
  background(0);
  rotateX(angle);
  rotateY(angle * 0.2);
  rotateZ(angle * 0.1);

  sponge.show();

  angle += 0.01;
}
