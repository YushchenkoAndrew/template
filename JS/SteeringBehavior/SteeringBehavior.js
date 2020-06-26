class SteeringBehavior {
  constructor(data) {
    this.particles = [];
    this.data = data;
    this.index = 0;
    let emptyV = createVector(0, 0);

    const fontSize = this.calcFontSize(data[0].fontSize);

    const points = this.getPoints(data[0], fontSize);

    for (let p of points) {
      let pos = createVector(random(0, W), random(0, H));
      let target = createVector(p.x, p.y);

      let particle = new Particle(pos, target, fontSize);
      particle.emptyV = emptyV;

      this.particles.push(particle);
    }

    this.explode = false;
    this.index = 1;
  }

  setExplosion() {
    this.explode = true;

    const fontSize = this.calcFontSize(this.data[this.index].fontSize);

    const points = this.getPoints(this.data[this.index], fontSize);
    this.index += this.index == this.data.length - 1 ? 0 : 1;

    let i;
    for (i = 0; i < points.length; i++) {
      if (this.particles[i]) {
        this.particles[i].target = createVector(points[i].x, points[i].y);
        this.particles[i].setFontSize(fontSize);
        continue;
      }

      let x = random(0, 1) > 0.5 ? random(-50, 0) : random(W, W + 50);
      let y = random(0, 1) > 0.5 ? random(-50, 0) : random(H, H + 50);

      let pos = createVector(x, y);
      let target = createVector(points[i].x, points[i].y);
      this.particles[i] = new Particle(pos, target, fontSize);
    }

    let len = this.particles.length - points.length;
    this.particles.splice(i, len);
  }

  changePointsAmount() {}

  getPoints(data, fontSize = 150) {
    let len = (data.value.length * 6 * fontSize) / 10;

    return f.textToPoints(
      data.value,
      data.x ? data.x : (W - len) / 2,
      data.y ? data.y : 400,
      fontSize,
      {
        sampleFactor: 0.01,
      }
    );
  }

  calcFontSize(fontSize) {
    let tmp = this.data[this.index].value.length * 6;

    let shift = this.data[this.index].x ? this.data[this.index].x : 0;

    return W - shift - (tmp * fontSize) / 10 < 0
      ? ((W - shift) / tmp) * 10
      : fontSize;
  }

  show() {
    for (let p of this.particles) {
      p.applyBehavior(this.explode);
      p.move();
      p.show();
    }
    this.explode = false;
  }
}
