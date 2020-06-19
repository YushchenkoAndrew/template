class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Bound {
  constructor(begin, end, c) {
    this.begin = createVector(begin.x, begin.y);
    this.end = createVector(end.x, end.y);
    this.color = c || color(255);
  }

  show() {
    stroke(this.color);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }

  getTexture(i) {
    return color(245 * (1 - i / 10) + 10, i, i);
  }
}
