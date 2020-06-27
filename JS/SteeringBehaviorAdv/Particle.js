class Particle {
  constructor(pos, target, fontSize = 100) {
    this.pos = pos;
    this.target = target;
    this.vel = p5.Vector.random2D();
    this.acc = createVector();

    this.r = fontSize / 10;
    this.desireR = 0;
    this.growing = false;

    this.maxSpeed = 40;
    this.maxForce = 0.5;
    this.explosionForce = 7;
    this.maxDist = dist(0, 0, W, H);
  }

  setFontSize(f) {
    this.desireR = f / 10;
    this.growing = true;
  }

  grow() {
    this.r += (this.desireR - this.r) / random(100, 200);
  }

  move() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  applyBehavior(exp, index) {
    let force;

    switch (index) {
      case "Exp": {
        force = this.explosion(mouse, exp);
        break;
      }
      case "Flee": {
        force = this.flee(mouse);
        break;
      }
      case "Mag": {
        force = this.flee(mouse).mult(-0.4);
        break;
      }
    }

    // let force = this.flee(mouse);
    // this.applyForce(force.mult(-0.4));
    this.applyForce(force);

    force = this.seekTarget(this.target);
    this.applyForce(force);

    if (this.growing) this.grow();
  }

  explosion(target, exp) {
    if (!mouseIsPressed && !exp) return this.emptyV;

    let direction = p5.Vector.sub(target, this.pos);
    direction.setMag(this.maxSpeed);

    if (exp) direction.mult(-1);

    let force = p5.Vector.sub(direction, this.vel);

    if (!exp) {
      const angle = (direction.mag() / this.maxDist) * 6;
      force.rotate(angle);

      force.limit(this.maxForce / 3);
    } else force.limit(this.explosionForce);

    return force.mult(5);
  }

  flee(target) {
    let direction = p5.Vector.sub(target, this.pos);

    if (direction.mag() > 100) return this.emptyV;

    direction.setMag(this.maxSpeed);
    direction.mult(-1);

    let force = p5.Vector.sub(direction, this.vel);
    force.limit(this.maxForce);

    return force.mult(5);
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

class Data {
  constructor(value, fontSize, y, x) {
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.value = value;
  }
}
