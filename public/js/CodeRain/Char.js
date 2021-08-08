class Char {
  constructor(pos, vel, color = "#64FF14") {
    this.vel = vel;
    this.pos = pos;

    this.char = {
      curr: undefined,
      final: undefined,
      color: color,
    };

    this.changeChar = setInterval(
      () => this.setRandomChar(),
      Math.round(Math.random() * 150 + 100)
    );

    this.setRandomChar();
  }

  setRandomChar() {
    let code =
      Math.random() > 0.5
        ? 48 + Math.round(Math.random() * 78)
        : 0x30a0 + Math.random() * 96;

    this.char.curr = String.fromCharCode(code);
  }

  isEnd() {
    return this.pos.y >= matrixCode.height;
  }

  move() {
    this.pos.y = this.isEnd()
      ? matrixCode.height - this.pos.y
      : this.pos.y + this.vel;
  }

  draw(stopFlag) {
    matrixCanvas.fillStyle = this.char.color;
    matrixCanvas.fillText(this.char.curr, this.pos.x, this.pos.y);

    if (stopFlag && this.char.final) {
      this.char.curr = this.char.final;
      this.char.color = "#FAFFDC";
      this.pos.y = matrixCode.height / 2;

      clearInterval(this.changeChar);
      return;
    }

    this.move();
  }
}
