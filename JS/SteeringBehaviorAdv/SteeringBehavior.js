class SteeringBehavior {
  constructor(data, stop) {
    this.particles = [];
    this.data = data;
    this.index = 0;
    this.emptyV = createVector(0, 0);
    this.stop = stop;

    this.index_beh = 0;
    this.behavior = ["Exp", "Flee", "Mag", "None"];

    const fontSize = this.calcFontSize(data[0].fontSize);

    const points = this.getPoints(data[0], fontSize);

    for (let p of points) {
      let pos = createVector(random(0, W), random(0, H));
      let target = createVector(p.x, p.y);

      let particle = new Particle(pos, target, fontSize);
      particle.emptyV = this.emptyV;

      this.particles.push(particle);
    }

    this.explode = false;
    this.index = 1;
  }

  changeData(explode = true) {
    this.explode = explode;

    const fontSize = this.calcFontSize(this.data[this.index].fontSize);

    const points = this.getPoints(this.data[this.index], fontSize);
    this.index =
      this.index == this.data.length - 1 || this.index >= this.stop
        ? this.index
        : this.index + 1;

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
      this.particles[i].emptyV = this.emptyV;
    }

    let len = this.particles.length - points.length;
    this.particles.splice(i, len);
  }

  changeEffect(delta) {
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      this.index_beh =
        this.index_beh == this.behavior.length - 1 ? 0 : this.index_beh + 1;
    }
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      this.index_beh =
        this.index_beh == 0 ? this.behavior.length - 1 : this.index_beh - 1;
    }

    if (delta) {
      this.index = this.index_beh + delta;
      this.changeData(false);
    }
  }

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
      p.applyBehavior(this.explode, this.behavior[this.index_beh]);
      p.move();
      p.show();
    }
    this.explode = false;
  }
}
