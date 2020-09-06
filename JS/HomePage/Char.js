class Char {
  constructor(point, vel, value = undefined) {
    this.pos = point;
    this.value;
    this.store = value;

    this.setRandomChar();

    this.color = "#64FF14";

    this.vel = vel;
    this.switchInterval = Math.round(Math.random() * 150 + 100);

    this.changeChar = setInterval(() => this.setRandomChar(), this.switchInterval);
  }

  setRandomChar() {
    let code = Math.random() > 0.5 ? 48 + Math.round(Math.random() * 78) : 0x30a0 + Math.random() * 96;

    this.value = String.fromCharCode(code);
  }

  move() {
    this.pos.y = this.pos.y >= window.innerHeight ? 0 : this.pos.y + this.vel;
  }

  show(stopFlag) {
    rainCanvas.fillStyle = this.color;
    rainCanvas.fillText(this.value, this.pos.x, this.pos.y);

    if (stopFlag && this.store) {
      this.value = this.store;
      this.color = "#FAFFDC";
      this.pos.y = window.innerHeight / 2;

      clearInterval(this.changeChar);
      return;
    }

    this.move();
  }
}
