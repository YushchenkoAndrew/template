class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Bound {
  constructor(begin, end) {
    this.begin = createVector(begin.x, begin.y);
    this.end = createVector(end.x, end.y);
  }

  show() {
    stroke(255);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }
}
