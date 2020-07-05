const W = 700;
const H = 700;

const R = 15;

const row = 40;
const col = 40;
const step = H / 20;

const div = (row * step) / H;

const scaleRow = H / row;
const scaleCol = W / col;

let path;
let map;

function setup() {
  createCanvas(W, H);

  map = new Generator();
  while (!map.move());

  let start = { i: 1, j: 1 };
  let end = { i: row - 1, j: col - 1 };

  path = new PathFinding(start, end);
  path.loadMap(map.grid);

  console.log(path);
}

function draw() {
  background(0);

  map.show();

  path.show();
  path.update();
}
