class Planet {
  constructor(x, y, level = 0) {
    this.pos = createVector(x, y);
    this.r = R * Math.pow(CHANGE, level);
    // this.dAngle = SPEED * Math.pow(5, level);
    this.dAngle = 0;
    // this.speed = 0.02 * Math.pow(2, level);
    // this.speed = Math.pow(-0.05, level + 1);
    this.speed = SPEED * Math.pow(K, level - 1);

    this.level = level;

    this.satellite;
  }

  rotate() {
    if (!this.satellite) return;

    let r = this.r / 2 + (this.satellite.r * DIR) / 2;

    let x = r * Math.cos(this.dAngle);
    let y = r * Math.sin(this.dAngle);

    this.satellite.pos = p5.Vector.add(this.pos, createVector(x, y));

    this.dAngle += this.speed;

    this.satellite.rotate();
  }

  getPoints() {
    if (this.satellite) return this.satellite.getPoints();

    return this.pos.copy();
  }

  isNewYear() {
    if (Math.abs(this.dAngle) < 2 * PI) return false;

    this.dAngle -= 2 * PI * Math.sign(this.dAngle);
    return true;
  }

  createSatellite(limit = 5) {
    if (this.satellite) return;

    this.satellite = new Planet(
      this.pos.x + this.r / 2 + (this.r * CHANGE * DIR) / 2,
      this.pos.y,
      this.level + 1
    );

    if (this.level + 1 < limit) this.satellite.createSatellite(limit);
  }

  show() {
    stroke(255);
    noFill();

    ellipse(this.pos.x, this.pos.y, this.r);

    if (this.satellite) this.satellite.show();
  }
}
