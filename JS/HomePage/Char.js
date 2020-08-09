class Char {
  constructor(point, vel, value = undefined) {
    this.pos = point;
    this.value;
    this.store = value;

    this.setRandomChar();

    this.color = header.color(100, 255, 20);

    this.vel = vel;
    this.switchInterval = Math.round(header.random(4, 15));
  }

  setRandomChar() {
    let code = header.random(0, 1) > 0.5 ? 48 + Math.round(header.random(0, 78)) : 0x30a0 + header.random(0, 96);

    this.value = String.fromCharCode(code);
  }

  move() {
    this.pos.y = this.pos.y >= H ? 0 : this.pos.y + this.vel;
  }

  show(stopFlag) {
    header.fill(this.color);
    header.text(this.value, this.pos.x, this.pos.y);

    if (stopFlag && this.store) {
      this.value = this.store;
      this.color = header.color(250, 255, 220);
      this.pos.y = H / 2;

      return;
    }

    this.move();

    if (header.frameCount % this.switchInterval == 0) this.setRandomChar();
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
