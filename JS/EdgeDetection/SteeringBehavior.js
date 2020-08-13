class SteeringBehavior {
  constructor(pos, target) {
    this.particles = [];
    this.emptyV = createVector(0, 0);

    for (let i in pos) {
      let particle = new Particle(pos[i], target[i]);
      particle.emptyV = this.emptyV;

      this.particles.push(particle);
    }
  }

  show() {
    for (let i in this.particles) {
      this.particles[i].applyBehavior();
      this.particles[i].move();
      this.particles[i].show();
    }

    // this.showDrawLine();
  }

  showDrawLine() {
    // stroke(255);

    for (let i = 1; i < this.particles.length; i++) {
      let start = coords(this.particles[i - 1].pos);
      let end = coords(this.particles[i].pos);

      let color = ((i / this.particles.length) * PI) / 2;
      stroke(color, 255, 255);

      line(...start, ...end);
    }

    function coords(pos) {
      let { x, y } = pos;
      return [x, y];
    }
  }
}
