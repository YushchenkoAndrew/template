class Ray {
  constructor(pos, angle) {
    this.pos = createVector(pos.x, pos.y);
    this.angle = angle;
    this.dir = createVector(1, 0);
    this.dir.rotate(angle);
  }

  setDir(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  intersect(border) {
    // Line line intersection: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection

    let p1 = new Point(border.begin.x, border.begin.y);
    let p2 = new Point(border.end.x, border.end.y);

    let p3 = new Point(this.pos.x, this.pos.y);
    let p4 = new Point(this.pos.x + this.dir.x, this.pos.y + this.dir.y);

    let temp = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

    if (temp == 0) return;

    let t =
      ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / temp;
    let u =
      -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / temp;

    if (t > 0 && t < 1 && u > 0) {
      return new Point(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));
    }

    return;
  }

  show() {
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, 15, 15);
    // line(0, 0, this.dir.x * 20, this.dir.y * 20);
    pop();
  }
}
