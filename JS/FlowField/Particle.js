class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prev = createVector(x, y);

    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }

  move() {
    this.prev = this.pos.copy();
    this.pos.add(this.vel);
    if (teleport(this.pos)) this.prev = this.pos.copy();

    this.vel.add(this.acc);
    this.vel.limit(VelLimit);

    this.acc.mult(0);

    function teleport(pos) {
      let changeX = pos.x <= 0 || pos.x >= W;
      let changeY = pos.y <= 0 || pos.y >= H;

      if (changeX) pos.x = pos.x <= 0 ? W - 1 : 0;
      if (changeY) pos.y = pos.y <= 0 ? H - 1 : 0;

      return changeX || changeY;
    }
  }

  applyForce(force) {
    this.acc = force.copy();
    this.move();
  }

  show() {
    strokeWeight(particleSize);
    stroke(0, showFlow ? 255 : 10);
    line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
  }
}
