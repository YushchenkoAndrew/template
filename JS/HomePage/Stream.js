class Stream {
  constructor(pos) {
    this.pos = pos;

    this.chars = [];
    this.length = Math.round(Math.random() * 10 + 5);

    this.vel = (Math.random() * matrixCanvas.height) / 300 + matrixCanvas.height / 400;
    this.shadowChar = Math.random() * this.length + 2;
    this.lightStep = 53 / (this.length - this.shadowChar);

    this.playFlag = false;
  }

  createLine(value) {
    for (let i = 0; i < this.length; i++) {
      let char = i == 0 ? value : undefined;

      this.chars.push(new Char({ x: this.pos.x, y: this.pos.y - fontSize * i }, this.vel, char));

      if (!value) this.chars[i].setRandomChar();

      // Shadow Effect
      if (i > this.shadowChar) this.chars[i].color = `hsl(${99},${99}%,${53 - (i - this.shadowChar) * this.lightStep}%)`;
    }

    if (Math.random() > 0.7) this.chars[0].color = "#FAFFDC";
  }

  getY(i = 0) {
    return this.chars[i].pos.y;
  }

  show(stopFlag) {
    stopFlag = stopFlag && this.getY() >= window.innerHeight / 2;

    if (this.chars[0].store) stopFlag = stopFlag && this.getY() <= window.innerHeight / 2 + fontSize;

    for (let i = 0; i < this.chars.length; i++) {
      this.chars[i].show(stopFlag);

      if (stopFlag && this.getY(i) >= window.innerHeight) this.chars.splice(i, 1);
    }
  }
}
