class Scene {
  constructor(drawEdge = true) {
    this.bounds = [];

    this.head = new Head(new Point(step / 2, step / 2));
    this.step = createVector(0, 3);
    this.step.rotate(PI / 2);

    if (drawEdge) this.createEdges();
  }

  createEdges() {
    this.bounds.push(new Bound(new Point(0, 0), new Point(W, 0), textures[1], color(155, 5, 5)));
    this.bounds.push(new Bound(new Point(0, H), new Point(W, H), textures[1], color(155, 5, 5)));
    this.bounds.push(new Bound(new Point(0, 0), new Point(0, H), textures[1], color(155, 5, 5)));
    this.bounds.push(new Bound(new Point(W, 0), new Point(W, H), textures[1], color(155, 5, 5)));
  }

  createRandomSurface(wallNum) {
    for (let i = 0; i < wallNum; i++) this.bounds.push(new Bound(new Point(random(0, W), random(0, H)), new Point(random(0, W), random(0, H)), textures[3]));
  }

  loadMap(map) {
    for (let cell of map) {
      let index = random(0, 1) > 0.99 ? Math.floor(random(2, 8)) : random(0, 1) > 0.9 ? 0 : 1;

      let texture = textures[index];

      for (let i in cell.walls) {
        if (cell.walls[i].isFree) {
          let points = [...cell.walls[i].value];

          this.bounds.push(new Bound(new Point(...points.splice(0, 2)), new Point(...points), texture));
        }
      }
    }
  }

  move() {
    if (keyIsPressed) {
      if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        this.head.setPos(p5.Vector.sub(this.head.pos, this.step));

        if (this.head.isIntersect(this.bounds)) this.head.setPos(p5.Vector.add(this.head.pos, this.step));
      }
      if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        this.head.setPos(p5.Vector.add(this.head.pos, this.step));

        if (this.head.isIntersect(this.bounds)) this.head.setPos(p5.Vector.sub(this.head.pos, this.step));
      }
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
        this.head.rotate(-0.03);
        this.step.rotate(-0.03);
      }
      if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        this.head.rotate(0.03);
        this.step.rotate(0.03);
      }
    }
  }

  debug() {
    this.head.setPos(createVector(mouseX, mouseY));
  }

  show() {
    let view = this.head.intersect(this.bounds);
    let w = W / view.length;

    for (let i = 0; i < view.length; i++) {
      noStroke();
      const ratio = (view[i].dist / W) * 2;
      const invRatio = 1 - ratio;

      //   Create a colored walls
      //   let c = view[i].bound.color;
      //   fill(invRatio * red(c), invRatio * green(c), invRatio * blue(c));
      //   rect(i * w, H * (1 + ratio / 2), w + 1, H * invRatio);

      // Add shadow
      //   tint(255 * invRatio, 255);

      image(view[i].bound.texture[i % 10], i * w, H * (1 + ratio / 2) + 25, w + 1, H * invRatio - 50);
    }
  }
}
