const W = window.innerWidth;
const H = window.innerHeight;

let R = 150;
const SIZE = 3.2;
const fontSize = 20;

let hypercube;
let angle;

let matrix;

let mousePos;

let autoRotation = true;

let selectedAxis = { x: {}, y: {}, z: {}, wx: {}, wy: {}, wz: {} };

function setup() {
  createCanvas(W, H);

  hypercube = new HigherDimension();

  matrix = new Matrix();

  selectedAxis.x.isSelected = false;
  selectedAxis.x.rotationMatrix = matrix.rotationMatrixOX;

  selectedAxis.y.isSelected = true;
  selectedAxis.y.rotationMatrix = matrix.rotationMatrixOY;

  selectedAxis.z.isSelected = false;
  selectedAxis.z.rotationMatrix = matrix.rotationMatrixOZ;

  selectedAxis.wx.isSelected = false;
  selectedAxis.wx.rotationMatrix = matrix.rotationMatrixXW;

  selectedAxis.wy.isSelected = true;
  selectedAxis.wy.rotationMatrix = matrix.rotationMatrixYW;

  selectedAxis.wz.isSelected = false;
  selectedAxis.wz.rotationMatrix = matrix.rotationMatrixZW;

  // hypercube.rotate(matrix.rotationMatrixOW(PI / 2));

  // hypercube.rotate(matrix.rotationMatrixOX(PI / 6, 4));
  // hypercube.rotate(matrix.rotationMatrixOY(PI / 6, 4));
  // hypercube.rotate(matrix.rotationMatrixOZ(-PI / 2, 4));
  angle = 0.01;

  mousePos = createVector(mouseX, mouseY);
}

function mouseClicked() {
  let axis = hypercube.convertTo2D(hypercube.axis);

  let offset3D = { x: 100, y: H / 2 + 300 };
  let offset4D = { x: 100, y: H / 2 + 100 };

  // 3D axis rotation

  if (check(axis[7], offset3D)) {
    if (!keyIsDown(CONTROL)) disableRotation();
    else if (selectedAxis.y.isSelected) {
      selectedAxis.y.isSelected = false;
      return;
    }

    selectedAxis.y.isSelected = true;

    return;
  }

  if (check(axis[1], offset3D)) {
    if (!keyIsDown(CONTROL)) disableRotation();
    else if (selectedAxis.z.isSelected) {
      selectedAxis.z.isSelected = false;
      return;
    }

    selectedAxis.z.isSelected = true;
    return;
  }

  if (check(axis[4], offset3D)) {
    if (!keyIsDown(CONTROL)) disableRotation();
    else if (selectedAxis.x.isSelected) {
      selectedAxis.x.isSelected = false;
      return;
    }

    selectedAxis.x.isSelected = true;
    return;
  }

  // 4D axis rotation

  if (check(axis[7], offset4D)) {
    if (!keyIsDown(CONTROL)) disableRotation();
    else if (selectedAxis.wy.isSelected) {
      selectedAxis.wy.isSelected = false;
      return;
    }

    selectedAxis.wy.isSelected = true;

    return;
  }

  if (check(axis[1], offset4D)) {
    if (!keyIsDown(CONTROL)) disableRotation();
    else if (selectedAxis.wz.isSelected) {
      selectedAxis.wz.isSelected = false;
      return;
    }

    selectedAxis.wz.isSelected = true;
    return;
  }

  if (check(axis[4], offset4D)) {
    if (!keyIsDown(CONTROL)) disableRotation();
    else if (selectedAxis.wx.isSelected) {
      selectedAxis.wx.isSelected = false;
      return;
    }

    selectedAxis.wx.isSelected = true;
    return;
  }

  function disableRotation() {
    for (let k in selectedAxis) selectedAxis[k].isSelected = false;

    autoRotation = false;
  }

  function check(point, offset) {
    let x =
      mouseX - 20 < point.x + offset.x && mouseX + 20 > point.x + offset.x;
    let y =
      mouseY - 20 < point.y + offset.y && mouseY + 20 > point.y + offset.y;

    return x && y;
  }
}

function mouseWheel(event) {
  if (R + event.delta > 30) R += event.delta;
}

function draw() {
  background(0);

  translate(W / 2, H / 2);

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

      hypercube.rotate(selectedAxis[k].rotationMatrix, delta);
    }

  // hypercube.rotate(matrix.rotationMatrixOX, angle);
  // hypercube.rotate(matrix.rotationMatrixOY, angle);
  // hypercube.rotate(matrix.rotationMatrixOZ, angle);
  // hypercube.rotate(matrix.rotationMatrixXW, angle);
  // hypercube.rotate(matrix.rotationMatrixYW, angle);
  // hypercube.rotate(matrix.rotationMatrixZW, angle);

  // angle += 0.05;
  //   rotateY(angle);

  mousePos.x = mouseX;
  mousePos.y = mouseY;

  // noLoop();
  hypercube.show();
}
