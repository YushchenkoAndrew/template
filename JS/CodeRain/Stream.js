class Stream {
  constructor(x, y) {
    this.chars = [];
    this.length = round(random(5, 20));

    this.vel = random(1, 5);
    this.shadowChar = random(2, this.length);

    this.createLine(x, y);
  }

  createLine(x, y) {
    for (let i = 0; i < this.length; i++) {
      this.chars.push(new Char(x, y - symbolSize * i, this.vel));
      this.chars[i].setRandomChar();

      if (i == 0 && random(0, 1) > 0.5)
        this.chars[i].color = color(250, 255, 220);

      if (i > this.shadowChar) {
        let c = this.chars[i].color;
        let invLength = this.length - i;

        let r = (red(c) / 255) * 10 * invLength;
        let g = (green(c) / 255) * 10 * invLength;
        let b = (blue(c) / 255) * 10 * invLength;

        this.chars[i].color = color(r, g, b);
      }
    }
  }

  show() {
    for (let i = 0; i < this.length; i++) {
      this.chars[i].show();
    }
  }
}
