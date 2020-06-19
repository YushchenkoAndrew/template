class Head {
  constructor(pos) {
    this.pos = createVector(pos.x, pos.y);
    this.rays = [];
    this.angle = 0;
    for (let a = -PI / 10; a < PI / 10; a += 0.005)
      this.rays.push(new Ray(this.pos, a));
  }

  rotate(delta) {
    this.angle = delta;
    for (let ray of this.rays) {
      ray.shiftAngle(delta);
    }
  }

  setPos(pos) {
    this.pos = pos;
    for (let ray of this.rays) {
      ray.pos = this.pos;
    }
  }

  intersect(bounds) {
    let scene = [];
    let lineIndex = 0;

    for (let ray of this.rays) {
      let closestWall = Infinity;
      let wall;
      let p;

      for (let bound of bounds) {
        let point = ray.intersect(bound);

        if (!point) continue;

        if (closestWall >= dist(this.pos.x, this.pos.y, point.x, point.y)) {
          closestWall = dist(this.pos.x, this.pos.y, point.x, point.y);
          wall = bound;
          // wall.dist = closestWall;
          p = point;
        }
      }
      if (p) {
        closestWall *= Math.cos(this.angle);

        scene.push({ dist: closestWall, bound: wall });

        if (lineIndex % 4 == 0) {
          stroke(255, 100);
          line(this.pos.x, this.pos.y, p.x, p.y);
        }
        lineIndex++;
      }
    }
    return scene;
  }

  show() {
    for (let ray of this.rays) ray.show();
  }
}
