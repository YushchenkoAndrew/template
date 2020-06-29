class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Bound {
  constructor(begin, end, texture, c) {
    this.begin = createVector(begin.x, begin.y);
    this.end = createVector(end.x, end.y);

    this.texture = [];
    const n = 10;
    const w = texture.width / n;
    for (let i = 0; i < n; i++)
      this.texture.push(texture.get(i * w, 0, w, texture.height));

    this.color = c || color(255);
  }

  show() {
    stroke(this.color);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }
}
