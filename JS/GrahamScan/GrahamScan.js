// Source:  https://en.wikipedia.org/wiki/Graham_scan#Pseudocode

class GrahamScan {
  // points -- it's array of vectors
  constructor(points) {
    this.points = [];
    this.stack = [];

    if (!points) return;

    for (let p of points) this.points.push(p.copy());

    this.default();
  }

  randomGenerator(n = 50) {
    for (let i = 0; i < n; i++) {
      let x = random(offset, W - offset);
      let y = random(offset, H - offset);
      this.points.push(createVector(x, y));
    }

    this.default();
  }

  //   Start algorith,
  default() {
    this.stack = [];
    this.P0 = this.points[0];

    for (let i = 1; i < this.points.length; i++) {
      if (
        this.points[i].y > this.P0.y ||
        (this.points[i].y == this.P0.y && this.points[0].x < this.P0.x)
      )
        this.P0 = this.points[i];
    }

    this.points.sort(compare.bind(this));

    function compare(a, b) {
      let o = this.orientation(this.P0, a, b);

      if (!o)
        return p5.Vector.dist(b, this.P0) >= p5.Vector.dist(a, this.P0)
          ? -1
          : 1;

      return o == 2 ? -1 : 1;
    }

    this.index = 3;
    this.stack.push(this.points[0]);
    this.stack.push(this.points[1]);
    this.stack.push(this.points[2]);
  }

  //   Source:    https://www.geeksforgeeks.org/orientation-3-ordered-points/
  orientation(p0, p1, p2) {
    let val = (p1.y - p0.y) * (p2.x - p1.x) - (p1.x - p0.x) * (p2.y - p1.y);

    // Colinear
    if (!val) return 0;

    // Counterclockwise or Clockwise
    return val > 0 ? 1 : 2;
  }

  add(point) {
    this.points.push(point);

    this.default();
  }

  update() {
    if (this.index == this.points.length) return true;

    let i = this.stack.length - 1;

    let o = this.orientation(
      this.stack[i - 1],
      this.stack[i],
      this.points[this.index]
    );

    if (o != 2) {
      this.stack.pop();
      return;
    }

    this.stack.push(this.points[this.index]);

    this.index++;
  }

  show() {
    noStroke();
    fill(255);
    for (let p of this.points) ellipse(p.x, p.y, 10);

    stroke(0, 0, 255);
    strokeWeight(5);
    fill(0, 0, 255, 50);

    // Show current Stack
    beginShape();
    for (let p of this.stack) vertex(p.x, p.y);

    // If Algorithm find the way then close figure
    if (this.update()) {
      endShape(CLOSE);
      return;
    }

    endShape();

    // Show Next guess
    let end = this.stack.length - 1;

    stroke(255, 0, 0);
    noFill();

    beginShape();

    vertex(this.stack[end - 1].x, this.stack[end - 1].y);
    vertex(this.stack[end].x, this.stack[end].y);

    endShape();

    // fill(255, 0, 0, 100);
    ellipse(this.stack[end].x, this.stack[end].y, 30);

    strokeWeight(1);
  }
}
