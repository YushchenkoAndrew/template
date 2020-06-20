class Particle {
  constructor(x, y, vel = -25) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, vel);
    this.gravity = createVector(0, 0.5);
  }

  move() {
    this.pos = p5.Vector.add(this.pos, this.vel);
    this.vel = p5.Vector.add(this.vel, this.gravity);
  }

  show() {
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}
