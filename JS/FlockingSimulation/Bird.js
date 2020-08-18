class Bird {
  constructor() {
    this.pos = createVector(random(0, W), random(0, H));
    this.vel = p5.Vector.random2D().setMag(4);
    this.acc = createVector(0, 0);

    this.limit = { speed: Math.random() * 4 + 3, force: [Math.random() * 0.1, Math.random() / 2, Math.random() * 0.1] };
    this.range = Math.floor(Math.random() * 10 + 5) * 10;
  }

  getCoords() {
    return [this.pos.x, this.pos.y];
  }

  move() {
    this.prev = this.pos.copy();
    this.pos.add(this.vel);
    if (teleport(this.pos)) this.prev = this.pos.copy();

    this.vel.add(this.acc);
    this.acc.mult(0);

    function teleport(pos) {
      let changeX = pos.x <= 0 || pos.x >= W;
      let changeY = pos.y <= 0 || pos.y >= H;

      if (changeX) pos.x = pos.x <= 0 ? W - 1 : 0;
      if (changeY) pos.y = pos.y <= 0 ? H - 1 : 0;

      return changeX || changeY;
    }
  }

  applyBehavior(behavior, i) {
    if (!behavior.mag()) return;
    // let direction = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);

    // if (direction.mag() > 100) return;

    behavior.setMag(this.limit.speed);
    // // direction.mult(-1);

    let force = p5.Vector.sub(behavior, this.vel);
    force.limit(this.limit.force[i] || 0.01);

    this.acc.add(force);
  }

  show() {
    let face = this.vel.copy().normalize().mult(offset);
    let back1 = face.copy();
    let back2 = face.copy();

    back1.rotate(ANGLE);
    back2.rotate(-ANGLE);

    face.add(this.pos);
    back1.add(this.pos);
    back2.add(this.pos);

    // noFill();
    fill(255, 50);
    stroke(255);
    beginShape();
    vertex(face.x, face.y);
    vertex(back1.x, back1.y);
    // vertex(this.pos.x, this.pos.y);
    vertex(back2.x, back2.y);
    endShape(CLOSE);
  }
}
