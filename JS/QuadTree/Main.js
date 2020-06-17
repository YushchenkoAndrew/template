const N = 700;

let qTree;
let range;

let points = [];

function setup() {
  createCanvas(N, N);

  let r = new Rectangle(0, 0, N, N);
  qTree = new QuadTree(r);

  for (let i = 0; i < 500; i++) {
    let x = random(0, N);
    let y = random(0, N);

    stroke(255);
    fill(255);
    ellipse(x, y, 5, 5);
    qTree.add(new Point(x, y));
  }

  frameRate(20);

  range = new Rectangle(200, 200, 100, 100);
  points.push(...qTree.getPoints(range));

  print(points);

  print(qTree);
}

function mouseDragged() {
  points = [];
  range = new Rectangle(mouseX - 50, mouseY - 50, 100, 100);
  points.push(...qTree.getPoints(range));
}

function mousePressed() {
  qTree.add(new Point(mouseX, mouseY));
}

function draw() {
  background(0);

  noFill();
  stroke(0, 255, 0);
  rect(range.x, range.y, range.w, range.h);

  qTree.show();

  for (let p of points) {
    stroke(255, 0, 0);
    fill(255, 0, 0);
    ellipse(p.x, p.y, 5, 5);
  }
}
