const W = 700;
const H = 700;

const R = 15;

const rate = W / H;

const row = 40;
const col = rate * row;
const step = (H * 2) / row;

const div = (row * step) / H;

const scaleRow = H / row;
const scaleCol = W / col;

let path;
let map;

let start;
let end;

let mouseCoords = {};

function setup() {
  createCanvas(W, H);

  map = new Generator();
  while (!map.move());
}

function mouseClicked() {
  if (path) {
    start = undefined;
    end = undefined;
    path = undefined;
    return;
  }

  if (!start) {
    start = {
      i: mouseCoords.i,
      j: mouseCoords.j,
    };

    return;
  }

  end = {
    i: mouseCoords.i,
    j: mouseCoords.j,
  };

  path = new PathFinding(start, end);
  path.loadMap(map.grid);
}

function draw() {
  background(0);

  mouseCoords.i = Math.floor(((mouseY + scaleRow / 2) / H) * row);
  mouseCoords.j = Math.floor(((mouseX + scaleCol / 2) / W) * col);

  map.show();

  if (path) {
    path.show();
    path.update();
  }

  showPoints();
}

function showPoints() {
  noStroke();

  fill(0, 0, 255);
  if (start) ellipse(start.j * scaleCol, start.i * scaleRow, scaleRow);
  else {
    ellipse(mouseCoords.j * scaleCol, mouseCoords.i * scaleRow, scaleRow);
    return;
  }

  fill(255, 0, 0);
  if (end) ellipse(end.j * scaleCol, end.i * scaleRow, scaleRow);
  else ellipse(mouseCoords.j * scaleCol, mouseCoords.i * scaleRow, scaleRow);
}
