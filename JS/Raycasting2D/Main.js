const N = 700;

let bounds = [];
let head;

let point;

function setup() {
  createCanvas(N, N);

  for (let i = 0; i < 5; i++)
    bounds.push(
      new Bound(
        new Point(random(0, N), random(0, N)),
        new Point(random(0, N), random(0, N))
      )
    );

  head = new Head(new Point(100, 500));

  console.log(
    "Double click set a point for wall\n 2 double click create a wall\n You can shift light source with pressing the mouse button"
  );
}

function doubleClicked() {
  if (!point) {
    point = new Point(mouseX, mouseY);
  } else {
    bounds.push(new Bound(point, new Point(mouseX, mouseY)));
    point = undefined;
  }
}

function draw() {
  background(0);

  if (mouseIsPressed) {
    head.setPos(new Point(mouseX, mouseY));
  }
  head.intersect(bounds);

  for (let bound of bounds) bound.show();
  head.show();
}
