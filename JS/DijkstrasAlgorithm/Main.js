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
    [0, 8, 0, 0, 0, 0, 15, 0],
    [8, 0, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 5, 2, 2, 0, 0],
    [0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 30, 3],
    [15, 0, 0, 0, 0, 30, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 2],
  ];

  textSize(fontSize);
  graph = new Graph(matrix, 300, 300);

  graph.findPath(0, 7);
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

  if (select) {
    graph.pos[node_index].x = mouseX;
    graph.pos[node_index].y = mouseY;
  }

  graph.show();
}
