const W = 800;
const H = 350;

let bounds = [];
let head;

let point;

function setup() {
  createCanvas(W, H * 2);

  for (let i = 0; i < 5; i++)
    bounds.push(
      new Bound(
        new Point(random(0, W), random(0, H)),
        new Point(random(0, W), random(0, H))
      )
    );

  bounds.push(new Bound(new Point(0, 0), new Point(W, 0)));
  bounds.push(new Bound(new Point(0, H), new Point(W, H)));
  bounds.push(new Bound(new Point(0, 0), new Point(0, H)));
  bounds.push(new Bound(new Point(W, 0), new Point(W, H)));

  head = new Head(new Point(100, 200));

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

  let scene = head.intersect(bounds);
  let w = W / scene.length;
  // print(scene);

  for (let i = 0; i < scene.length; i++) {
    noStroke();
    let ratio = scene[i] / Math.sqrt(W * W + H * H);
    fill(180 - ratio * 180);

    let h = ratio * H;

    rect(i * w, H + h / 2, w + 1, H - h);
  }

  for (let bound of bounds) bound.show();
  head.show();
}
