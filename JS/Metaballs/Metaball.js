class Metaball {
  constructor() {
    this.r = random(step / 10, 10) * 10;
    let x = random(this.r, W - this.r);
    let y = random(this.r, H - this.r);

    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
  }

  update() {
    let next = p5.Vector.add(this.pos, this.vel);
    let chX = next.x - this.r < 0 || next.x + this.r > W;
    let chY = next.y - this.r < 0 || next.y + this.r > H;

    if (chX || chY) {
      this.vel.x *= chX ? -1 : 1;
      this.vel.y *= chY ? -1 : 1;
    }

    this.pos.add(this.vel);
  }

  show() {
    stroke(0, 255, 0);
    noFill();
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}
