class Particle {
  constructor(pos, target) {
    this.pos = pos;
    this.target = target;
    this.vel = p5.Vector.random2D();
    this.acc = createVector();

    this.r = 10;
    this.maxSpeed = 15;
    this.maxForce = 2;
  }

  move() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  applyBehavior() {
    let mouse = createVector(mouseX, mouseY);
    let force = this.flee(mouse);

    force.mult(5);

    this.applyForce(force);

    // let force = this.seekTarget();
    force = this.arrive();

    this.applyForce(force);
  }

  seekTarget() {
    let direction = p5.Vector.sub(this.target, this.pos);
    direction.setMag(this.maxSpeed);

    let force = p5.Vector.sub(direction, this.vel);
    force.limit(this.maxForce);
    return force;
  }
  flee(target) {
    let direction = p5.Vector.sub(target, this.pos);

    if (direction.mag() < 200) {
      direction.setMag(this.maxSpeed);
      direction.mult(-1);

      let force = p5.Vector.sub(direction, this.vel);
      force.limit(this.maxForce);
      return force;
    }

    return createVector(0, 0);
  }

  arrive() {
    let direction = p5.Vector.sub(this.target, this.pos);

    const maxDist = dist(0, 0, W, H);
    const speed = (direction.mag() / maxDist) * this.maxSpeed;

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
