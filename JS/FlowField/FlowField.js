class FlowField {
  constructor(n = 50) {
    this.width = Math.floor(W / step);
    this.hight = Math.floor(H / step);

    this.flow = [];
    for (let i = 0; i < this.hight; i++) this.flow.push([]);

    this.particles = [];

    for (let i = 0; i < n; i++) {
      let x = random(0, W);
      let y = random(0, H);

      this.particles.push(new Particle(x, y));
    }

    this.zoff = 0;
    this.calcFlow();
  }

  calcFlow() {
    for (let i = 0; i < this.hight; i++) {
      for (let j = 0; j < this.width; j++) {
        let angle = noise(j / 10, i / 10, this.zoff) * 4 * PI;
        this.flow[i][j] = p5.Vector.fromAngle(angle);
      }
    }

    this.zoff += 0.005;
  }

  show(showVector = 1) {
    for (let i in this.particles) {
      let x = Math.floor(this.particles[i].pos.x / step);
      let y = Math.floor(this.particles[i].pos.y / step);

      this.particles[i].applyForce(this.flow[y][x]);
      this.particles[i].show();
    }

    if (!showVector) return;

    stroke(0);
    strokeWeight(1);

    for (let i in this.flow) {
      for (let j in this.flow[i]) {
        let x = j * step;
        let y = i * step;
        let dx = this.flow[i][j].x * step;
        let dy = this.flow[i][j].y * step;
        line(x, y, x + dx, y + dy);
      }
    }
  }
}
