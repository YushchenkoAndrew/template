const W = window.innerWidth;
const H = window.innerHeight;

let R = 100;
const SIZE = 3.2;
const fontSize = 20;

let dimension;
let angle;

let matrix;

let mousePos;

let autoRotation = true;

let selectedAxis = { x: {}, y: {}, z: {} };

let mouse;

function setup() {
  createCanvas(W, H);

  matrix = new Matrix();

  dimension = new HigherDimension(new EuclideanSystem());
  // dimension = new HigherDimension(new SphericalSystem());

  // dimension.drawLine();

  console.log(dimension.points);

  selectedAxis.x.isSelected = true;
  selectedAxis.x.rotationMatrix = matrix.rotationMatrixOX;

  selectedAxis.y.isSelected = true;
  selectedAxis.y.rotationMatrix = matrix.rotationMatrixOY;

  selectedAxis.z.isSelected = false;
  selectedAxis.z.rotationMatrix = matrix.rotationMatrixOZ;

  mouse = new MouseControl();

  // dimension.rotate(matrix.rotationMatrixOX, PI);
  // hypercube.rotate(matrix.rotationMatrixOY(PI / 6, 4));
  // hypercube.rotate(matrix.rotationMatrixOZ(-PI / 2, 4));
  angle = 0.01;

  mousePos = createVector(mouseX, mouseY);
}

function mouseClicked() {
  mouse.rotate(dimension.convertTo2D(dimension.axis));
}

function mouseWheel(event) {
  mouse.resize(event.delta);
}

function doubleClicked() {
  mouse.newLine();
  console.log("Yep");
}

function draw() {
  background(0);

  translate(W / 2, H / 2);

  mouse.rotateLine();

  // Press 'q' for continue autorotation
  if (keyIsDown(81)) autoRotation = true;

  // hypercube.rotate(matrix.rotationMatrixOY(-PI / 6, 4));

  // if (mouseIsPressed) {
  // hypercube.rotate(matrix.rotationMatrixOX, ((mouseY - mousePos.y) / H) * 4);
  // hypercube.rotate(matrix.rotationMatrixOY, ((mouseX - mousePos.x) / W) * 8);
  // }

  for (let k in selectedAxis)
    if (selectedAxis[k].isSelected && (mouseIsPressed || autoRotation)) {
      let delta = k.includes("x")
        ? ((mouseY - mousePos.y) / H) * 4
        : ((mouseX - mousePos.x) / W) * 8;

      delta = autoRotation ? angle : delta;

      dimension.rotate(selectedAxis[k].rotationMatrix, delta);
    }

  // hypercube.rotate(matrix.rotationMatrixOX, angle);
  // hypercube.rotate(matrix.rotationMatrixOY, angle);
  // hypercube.rotate(matrix.rotationMatrixOZ, angle);
  // hypercube.rotate(matrix.rotationMatrixXW, angle);
  // hypercube.rotate(matrix.rotationMatrixYW, angle);
  // hypercube.rotate(matrix.rotationMatrixZW, angle);

  // angle += 0.05;
  //   rotateY(angle);

  // if (frameCount % 50 == 0) {
  //   dimension.points = [];

  //   if (Math.floor(frameCount / 50) % 2 == 0) {
  //     dimension.createEuclideanSpace(200, 200);

  //     console.log(`Euclidean ${dimension.points.length}`);
  //   } else {
  //     dimension.createSphericalSpace();

  //     console.log(`Spherical ${dimension.points.length}`);
  //   }
  // }

  mousePos.x = mouseX;
  mousePos.y = mouseY;

  // noLoop();
  dimension.show();
}
