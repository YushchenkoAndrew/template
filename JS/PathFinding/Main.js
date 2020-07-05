const W = 700;
const H = 700;

const R = 15;

const row = 50;
const col = 50;

const scaleRow = H / row;
const scaleCol = W / col;

let path;

function setup() {
  createCanvas(W, H);

  let start = { i: 0, j: 0 };
  let end = { i: row - 1, j: col - 1 };

  path = new PathFinding(start, end);

  console.log(path);

  //   frameRate(1);
}

function draw() {
  background(0);

  path.show();
  path.update();
}
