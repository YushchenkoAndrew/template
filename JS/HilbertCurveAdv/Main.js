const W = 700;
const H = W;

let order = 1;

let curve;
let next;

let changing;

function setup() {
  createCanvas(W, H);

  // Change Color mode for Coloring in different colors
  colorMode(HSB, 2 * PI, 255, 255);

  next = new HilbertCurve(order + 1);
  curve = new HilbertCurve(order);
  curve.setOrder(order, next);

  console.log("Click Mouse for increase order for Hilbert Curve");
  console.log("Set 'showNum = true' for showing number of each Node");

  while (!curve.update());
  while (!next.update());

  changing = new SteeringBehavior(curve.getPoints(), curve.getPoints());
}

function mouseClicked() {
  if (order == 7) return;

  changeShowingOrder();

  curve.setOrder(++order);
  next.setOrder(order + 1);

  while (!curve.update());
  while (!next.update());
}

function changeShowingOrder() {
  let points = curve.getPoints();

  let pos = [points[0].copy()];

  for (let i = 1; i < points.length; i++) {
    let dxy = p5.Vector.sub(points[i], points[i - 1]);

    for (let j = 0; j < 4; j++) {
      let dv = dxy.copy().mult(j * 0.2);

      pos.push(p5.Vector.add(points[i - 1], dv));
    }

    if (!(i % Math.pow(2, order * 2 - 1))) pos.push(points[i].copy());
  }
  pos.push(points[points.length - 1].copy());
  pos.push(points[points.length - 1].copy());

  changing = new SteeringBehavior(pos, next.getPoints());
}

function draw() {
  background(0);

  changing.show();

  // curve.update();
  // curve.show();
  // next.show();
}
