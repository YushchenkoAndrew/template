class Particle {
  constructor(pos, target) {
    this.pos = pos;
    this.target = target;
    this.vel = p5.Vector.random2D();
    this.acc = createVector();

    this.r = 10;

    this.maxSpeed = 40;
    this.maxForce = 0.5;
    this.explosionForce = 7;
    this.maxDist = dist(0, 0, W, H);
  }

  move() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  applyBehavior() {
    let force = this.seekTarget(this.target);
    this.applyForce(force);
  }

  seekTarget(target) {
    let direction = p5.Vector.sub(target, this.pos);

    const speed = (direction.mag() / this.maxDist) * this.maxSpeed;

    direction.setMag(speed);

    let force = p5.Vector.sub(direction, this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r);
  }
}
