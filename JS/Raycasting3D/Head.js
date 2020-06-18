class Head {
  constructor(pos) {
    this.pos = pos;
    this.rays = [];
    for (let a = -PI / 16; a < PI / 16; a += 0.004)
      this.rays.push(new Ray(this.pos, a));
  }

  setPos(pos) {
    this.pos = pos;
    for (let ray of this.rays) {
      ray.pos.x = pos.x;
      ray.pos.y = pos.y;
    }
  }

  intersect(bounds) {
    let scene = [];

    for (let ray of this.rays) {
      let closestDist = Infinity;
      let p;
      let d;

      for (let bound of bounds) {
        let point = ray.intersect(bound);

        if (
          point &&
          closestDist > dist(this.pos.x, this.pos.y, point.x, point.y)
        ) {
          closestDist = dist(this.pos.x, this.pos.y, point.x, point.y);
          p = point;
        }
      }
      if (p) {
        scene.push(closestDist * Math.cos(ray.angle));

        push();
        translate(ray.pos.x, ray.pos.y);
        stroke(255, 50);
        line(0, 0, p.x - ray.pos.x, p.y - ray.pos.y);
        // fill(255, 100);
        // ellipse(p.x - ray.pos.x, p.y - ray.pos.y, 2, 2);
        pop();
      }
    }
    return scene;
  }

  show() {
    for (let ray of this.rays) ray.show();
  }
}
