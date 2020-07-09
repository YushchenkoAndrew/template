const W = window.innerWidth;
const H = window.innerHeight;

const R = 150;
const SIZE = 3.2;

let hypercube;
let angle;

let matrix;

function setup() {
  createCanvas(W, H);

  hypercube = new HigherDimension();

  matrix = new Matrix();

  // hypercube.rotate(matrix.rotationMatrixOW(PI / 2));

  // hypercube.rotate(matrix.rotationMatrixOX(PI / 6, 4));
  // hypercube.rotate(matrix.rotationMatrixOY(PI / 6, 4));
  // hypercube.rotate(matrix.rotationMatrixOZ(-PI / 2, 4));
  angle = 0.01;
}

function draw() {
  background(0);

  translate(W / 2, H / 2);

  // hypercube.rotate(matrix.rotationMatrixOY(-PI / 6, 4));

  // hypercube.rotate(matrix.rotationMatrixOX(angle, 4));
  hypercube.rotate(matrix.rotationMatrixOY(-angle, 4));
  // hypercube.rotate(matrix.rotationMatrixOZ(angle, 4));
  // hypercube.rotate(matrix.rotationMatrixXW(angle));
  hypercube.rotate(matrix.rotationMatrixYW(-angle));
  // hypercube.rotate(matrix.rotationMatrixZW(angle));

  // angle += 0.05;
  //   rotateY(angle);

  // noLoop();
  hypercube.show();
}
