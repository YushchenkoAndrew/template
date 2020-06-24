class Circle {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.index = index;

    this.r = 0.5;

    this.step = random(0.2, 1);
    // this.step = 0.5;

    this.growing = true;
  }

  grow() {
    this.r += this.growing ? this.step : 0;
  }

  show() {
    stroke(255);
    noFill();
    ellipse(this.x, this.y, this.r * 2);
  }
}
