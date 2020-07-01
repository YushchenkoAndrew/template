const W = 700;
const H = 700;

const step = 50;
const fontSize = 24;

let graph;

let select = false;
let node_index;

function setup() {
  createCanvas(W, H);

  let matrix = [
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 1, 0],
  ];

  textSize(fontSize);
  graph = new Graph(matrix, 300, 300);
}

function doubleClicked() {
  if (select) {
    select = false;
    return;
  }

  for (let i in graph.pos) {
    let x =
      mouseX > graph.pos[i].x - graph.r && mouseX < graph.pos[i].x + graph.r;
    let y =
      mouseY > graph.pos[i].y - graph.r && mouseY < graph.pos[i].y + graph.r;

    if (x && y) {
      node_index = i;
      select = true;
      return;
    }
  }
}

function mouseClicked() {
  select = false;
}

function draw() {
  background(0);

  if (select) graph.pos[node_index] = { x: mouseX, y: mouseY };

  graph.show();
}
