class Circle {
  constructor(x, y, index, color = 255) {
    this.x = x;
    this.y = y;
    this.index = index;

    this.color = color;

    this.r = 2;

    this.step = random(0.1, 1);

    this.growing = true;
  }

  grow() {
    this.r += this.growing ? this.step : 0;
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
  }
}
