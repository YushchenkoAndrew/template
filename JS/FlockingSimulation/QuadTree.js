class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contain(p) {
    return this.x < p.x && this.y < p.y && this.x + this.w > p.x && this.y + this.h > p.y;
  }

  show(color = 255) {
    noFill();
    stroke(color);
    rect(this.x, this.y, this.w, this.h);
  }

  intersect(range) {
    return this.x > range.x + range.w && this.x + this.w < range.x && this.y > range.y + range.h && this.y + this.h < range.x;
  }
}

class QuadTree {
  constructor(bound, cap = 4) {
    this.bound = bound;
    this.capacity = cap;
    this.points = [];
    this.divided = false;
  }

  subDivide() {
    let { x, y, w, h } = this.bound;

    let ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
    let nw = new Rectangle(x, y, w / 2, h / 2);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    let sw = new Rectangle(x, y + h / 2, w / 2, h / 2);

    this.northWest = new QuadTree(nw);
    this.northEast = new QuadTree(ne);
    this.southWest = new QuadTree(sw);
    this.southEast = new QuadTree(se);

    this.divided = true;
  }

  add(p) {
    if (!this.bound.contain(p.pos)) return;

    if (this.points.length < this.capacity || this.bound.w < 8 || this.bound.h < 8) {
      this.points.push(p);
    } else {
      if (!this.divided) this.subDivide();

      this.northWest.add(p);
      this.northEast.add(p);
      this.southWest.add(p);
      this.southEast.add(p);
    }
  }

  show(showPoints = true) {
    this.bound.show();

    if (this.divided) {
      this.northWest.show(showPoints, this.capacity);
      this.northEast.show(showPoints, this.capacity);
      this.southWest.show(showPoints, this.capacity);
      this.southEast.show(showPoints, this.capacity);
    }

    if (!showPoints) return;

    for (let p of this.points) {
      stroke(255);
      fill(255);
      ellipse(p.pos.x, p.pos.y, 5, 5);
    }
  }

  getPoints(range) {
    let result = [];

    if (this.bound.intersect(range)) return result;

    for (let p of this.points) {
      if (range.contain(p.pos)) result.push(p);
    }

    if (this.divided) {
      result.push(...this.northWest.getPoints(range));
      result.push(...this.northEast.getPoints(range));
      result.push(...this.southWest.getPoints(range));
      result.push(...this.southEast.getPoints(range));
    }

    return result;
  }
}
