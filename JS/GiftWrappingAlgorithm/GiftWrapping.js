// Source: https://en.wikipedia.org/wiki/Gift_wrapping_algorithm#Pseudocode

class GiftWrapping {
  constructor(n = 20) {
    this.points = [];
    this.path = [];

    for (let i = 0; i < n; i++) {
      let x = random(offset, W - offset);
      let y = random(offset, H - offset);
      this.points.push(createVector(x, y));
    }
    this.default();
  }

  default() {
    this.points.sort((a, b) => a.x - b.x);

    this.path = [];
    this.path.push(this.points[0]);

    this.pointOnHull = this.points[0];
    this.endPoint = this.points[1];
    this.index = 2;
  }

  add(point) {
    this.points.push(point);
    this.path = [];
    this.default();
  }

  update() {
    let i = this.path.length - 1;
    if (this.path[0] == this.path[i] && i) return true;

    let a = p5.Vector.sub(this.endPoint, this.pointOnHull);
    let b = p5.Vector.sub(this.points[this.index], this.pointOnHull);
    let c = p5.Vector.cross(a, b);

    if (c.z < 0) this.endPoint = this.points[this.index];

    if (this.index + 1 == this.points.length) {
      this.pointOnHull = this.endPoint;
      this.path.push(this.endPoint);

      this.index = 0;
      this.endPoint = this.points[0];
    }

    this.index++;
  }

  show() {
    //   Show all Points
    fill(255);
    stroke(255);

    for (let p of this.points) circle(p.x, p.y, 10);

    // Show found path
    fill(0, 0, 255, 50);
    stroke(0, 0, 255);
    strokeWeight(5);

    beginShape();
    for (let p of this.path) vertex(p.x, p.y);

    endShape();
    strokeWeight(3);

    if (this.update()) return;

    // Show current best guess
    stroke(255, 0, 0);
    line(
      this.pointOnHull.x,
      this.pointOnHull.y,
      this.endPoint.x,
      this.endPoint.y
    );

    // Show next best guess
    stroke(0, 255, 0);
    line(
      this.pointOnHull.x,
      this.pointOnHull.y,
      this.points[this.index].x,
      this.points[this.index].y
    );

    // noStroke();
    // fill(0, 0, 255);
    // circle(this.points[0].x, this.points[0].y, 10);
  }
}
