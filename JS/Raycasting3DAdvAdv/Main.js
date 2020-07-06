const W = 700;
const H = 350;

const R = 15;

const rate = W / H;

const row = 20;
const col = rate * row;
const step = (H * 2) / row;

const div = (row * step) / H;

const scaleRow = H / row;
const scaleCol = W / col;

let scene;
let path;
let map;

let start;
let end;

let current;

let textures = [];

let mouseCoords = {};

function preload() {
  img = loadImage("textures.png");
}

function setup() {
  createCanvas(W, H * 2);

  loadTexture();

  map = new Generator();
  while (!map.move());

  scene = new Scene(false);
  scene.loadMap(map.grid);
}

function loadTexture() {
  const w = img.width / 8;

  for (let i = 0; i < 8; i++) {
    textures.push(img.get(i * w, 0, w, img.height));
  }
}

function mouseClicked() {
  if (mouseCoords.i > row - 1 || mouseCoords.j > col - 1) return;

  start = {
    i: Math.floor(((scene.head.pos.y + scaleRow / 2) / H) * row),
    j: Math.floor(((scene.head.pos.x + scaleCol / 2) / W) * col),
  };

  current = 1;

  console.log(scene.head.pos);

  console.log(start);

  end = {
    i: mouseCoords.i,
    j: mouseCoords.j,
  };

  path = new PathFinding(start, end);
  path.loadMap(map.grid);

  while (!path.update());
}

function draw() {
  background(0);

  mouseCoords.i = Math.floor(((mouseY + scaleRow / 2) / H) * row);
  mouseCoords.j = Math.floor(((mouseX + scaleCol / 2) / W) * col);

  // map.show();

  if (path) {
    path.show();

    if (current < path.path.length) {
      current = !scene.moveAI(
        path.path[Math.floor(current - 1)],
        path.path[Math.floor(current)]
      )
        ? current
        : current + 0.1;
    }
    // path.update();
  }

  showPoints();

  scene.show();
  scene.move();

  for (let bound of scene.bounds) bound.show();

  scene.head.show();
}

function showPoints() {
  noStroke();

  fill(0, 0, 255);
  ellipse(mouseCoords.j * scaleCol, mouseCoords.i * scaleRow, scaleRow);

  fill(255, 0, 0);
  if (end) ellipse(end.j * scaleCol, end.i * scaleRow, scaleRow);
  else ellipse(mouseCoords.j * scaleCol, mouseCoords.i * scaleRow, scaleRow);
}
