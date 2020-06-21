class Stream {
  constructor(pos) {
    this.pos = pos;

    this.chars = [];
    this.length = round(random(5, 20));

    this.vel = random(1, 5);
    this.shadowChar = random(2, this.length);
  }

  createLine(value) {
    for (let i = 0; i < this.length; i++) {
      let p = new Point(this.pos.x, this.pos.y - textSize() * i);
      let char = i == 0 ? value : undefined;

      this.chars.push(new Char(p, this.vel, char));

      if (!value) this.chars[i].setRandomChar();

      this.createShadowEffect(i);
    }

    if (random(0, 1) > 0.7 || value) this.highlightFirst();
  }

  highlightFirst() {
    this.chars[0].color = color(250, 255, 220);
  }

  createShadowEffect(i) {
    if (i > this.shadowChar) {
      let c = this.chars[i].color;
      let invLength = this.length - i;

      let r = (red(c) / 255) * 10 * invLength;
      let g = (green(c) / 255) * 10 * invLength;
      let b = (blue(c) / 255) * 10 * invLength;

      this.chars[i].color = color(r, g, b);
    }
  }

  getY(i = 0) {
    return this.chars[i].pos.y;
  }

  show(stopFlag) {
    for (let i = 0; i < this.length; i++) {
      if (!this.chars[i]) return;

      this.chars[i].show(stopFlag);

      if (stopFlag && this.getY(i) >= H - textSize()) this.chars.splice(i, 1);
    }
  }
}
