class Stream {
  constructor(pos) {
    this.pos = pos;

    this.chars = [];
    this.length = Math.round(header.random(5, 20));

    this.vel = header.random(1, 5);
    this.shadowChar = header.random(2, this.length);

    this.playFlag = false;
  }

  createLine(value) {
    for (let i = 0; i < this.length; i++) {
      let p = new Point(this.pos.x, this.pos.y - header.textSize() * i);
      let char = i == 0 ? value : undefined;

      this.chars.push(new Char(p, this.vel, char));

      if (!value) this.chars[i].setRandomChar();

      this.createShadowEffect(i);
    }

    if (header.random(0, 1) > 0.7) this.highlightFirst();
  }

  highlightFirst() {
    this.chars[0].color = header.color(250, 255, 220);
  }

  createShadowEffect(i) {
    if (i > this.shadowChar) {
      let c = this.chars[i].color;
      let invLength = this.length - i;

      let r = (header.red(c) / 255) * 10 * invLength;
      let g = (header.green(c) / 255) * 10 * invLength;
      let b = (header.blue(c) / 255) * 10 * invLength;

      this.chars[i].color = header.color(r, g, b);
    }
  }

  getY(i = 0) {
    return this.chars[i].pos.y;
  }

  show(stopFlag) {
    if (this.chars[0].store) stopFlag = stopFlag && this.getY() <= H / 2 + header.textSize();

    for (let i = 0; i < this.chars.length; i++) {
      this.chars[i].show(stopFlag);

      if (stopFlag && this.getY(i) >= H - header.textSize()) this.chars.splice(i, 1);
    }
  }
}
