class Char {
  constructor(x, y, vel) {
    this.x = x;
    this.y = y;
    this.value;

    this.color = color(100, 255, 20);

    this.vel = vel;
    this.switchInterval = round(random(4, 15));
  }

  setRandomChar() {
    let code =
      random(0, 1) > 0.5 ? 48 + round(random(0, 78)) : 0x30a0 + random(0, 96);

    this.value = String.fromCharCode(code);
  }

  move() {
    this.y = this.y >= H ? 0 : this.y + this.vel;
  }

  show() {
    fill(this.color);
    text(this.value, this.x, this.y);
    this.move();

    if (frameCount % this.switchInterval == 0) this.setRandomChar();
  }
}
