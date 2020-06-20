class Firework {
  constructor(x, y, vel, c) {
    this.particle = new Particle(x, y, vel);
    this.color = c || color(255);

    this.explodePieces;

    this.end = false;
  }

  exploding() {
    for (let i = 0; i < random(40, 100); i++) {
      let p = new Particle(this.particle.pos.x, this.particle.pos.y);
      p.vel = p5.Vector.random2D().mult(random(5, 12));
      this.explodePieces.push({ p: p, brDEC: random(2, 10), brightness: 255 });
    }
  }

  move() {
    if (this.particle.vel.y < 0) this.particle.move();
    else {
      this.explodePieces = [];
      this.exploding();
      this.particle = undefined;
    }
  }

  show() {
    if (this.particle) {
      fill(this.color);

      this.particle.show();
      this.move();
    }

    if (this.explodePieces) this.showPieces();
  }

  calcBrightness(brightness) {
    let r = (red(this.color) / 255) * brightness;
    let g = (green(this.color) / 255) * brightness;
    let b = (blue(this.color) / 255) * brightness;

    fill(color(r, g, b));
  }

  showPieces() {
    for (let i = this.explodePieces.length - 1; i >= 0; i--) {
      this.calcBrightness(this.explodePieces[i].brightness);

      this.explodePieces[i].p.move();
      this.explodePieces[i].p.show();

      this.explodePieces[i].brightness -= this.explodePieces[i].brDEC;

      if (this.explodePieces[i].brightness <= 50) {
        this.explodePieces.splice(i, 1);
      }
    }

    this.end = this.explodePieces.length == 0;
  }

  isEnd() {
    return this.end;
  }
}
