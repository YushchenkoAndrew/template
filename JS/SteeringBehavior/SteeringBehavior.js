class SteeringBehavior {
  constructor(points) {
    this.particles = [];

    for (let p of points) {
      let pos = createVector(random(0, W), random(0, H));
      let target = createVector(p.x, p.y);

      this.particles.push(new Particle(pos, target));
    }
  }

  show() {
    for (let p of this.particles) {
      p.applyBehavior();
      p.move();
      p.show();
    }
  }
}
