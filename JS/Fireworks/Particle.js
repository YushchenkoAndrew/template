class Particle {
  constructor(x, y, z, vel = -25) {
    this.pos = createVector(x, y, z);
    this.vel = createVector(0, vel, 0);
    this.gravity = createVector(0, 0.5, 0);
  }

  move() {
    this.pos = p5.Vector.add(this.pos, this.vel);
    this.vel = p5.Vector.add(this.vel, this.gravity);
  }

  show() {
    // ellipse(this.pos.x, this.pos.y, 5, 5);
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(5);
    pop();
  }
}
