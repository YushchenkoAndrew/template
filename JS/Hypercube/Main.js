const W = window.innerWidth;
const H = window.innerHeight;

const R = 150;

let hypercube;
let angle;

let matrix;

function setup() {
  createCanvas(W, H, WEBGL);

  hypercube = new HigherDimension();

  matrix = new Matrix();

  //   hypercube.rotate(matrix.rotationMatrixOX(PI / 4, 4));
  //   hypercube.rotate(matrix.rotationMatrixOY(PI / 4, 4));
  //   hypercube.rotate(matrix.rotationMatrixOZ(PI / 4, 4));
  angle = 0.01;
}

function draw() {
  background(0);

  hypercube.rotate(matrix.rotationMatrixOY(angle, 4));
  hypercube.rotate(matrix.rotationMatrixOW(angle));

  //   rotateY(angle);

  hypercube.convertTo3D();
  //   hypercube.show();
}
