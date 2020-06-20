class Scene {
  constructor() {
    this.bounds = [];

    this.head = new Head(new Point(100, 200));
    this.step = createVector(0, 3);
    this.step.rotate(PI / 2);
    this.createEdges();
  }

  createEdges() {
    this.bounds.push(
      new Bound(new Point(0, 0), new Point(W, 0), textures[1], color(155, 5, 5))
    );
    this.bounds.push(
      new Bound(new Point(0, H), new Point(W, H), textures[1], color(155, 5, 5))
    );
    this.bounds.push(
      new Bound(new Point(0, 0), new Point(0, H), textures[1], color(155, 5, 5))
    );
    this.bounds.push(
      new Bound(new Point(W, 0), new Point(W, H), textures[1], color(155, 5, 5))
    );
  }

  createRandomSurface(wallNum) {
    for (let i = 0; i < wallNum; i++)
      scene.bounds.push(
        new Bound(
          new Point(random(0, W), random(0, H)),
          new Point(random(0, W), random(0, H)),
          textures[3]
        )
      );
  }

  move() {
    if (keyIsPressed) {
      if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        this.head.setPos(p5.Vector.sub(this.head.pos, this.step));
      }
      if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        this.head.setPos(p5.Vector.add(this.head.pos, this.step));
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
      const ratio = view[i].dist / Math.sqrt(W * W + H * H);
      const invRatio = 1 - ratio;

      //   Create a colored walls
      //   let c = view[i].bound.color;
      //   fill(invRatio * red(c), invRatio * green(c), invRatio * blue(c));
      //   rect(i * w, H * (1 + ratio / 2), w + 1, H * invRatio);

      // Add shadow
      //   tint(255 * invRatio, 255);

      image(
        view[i].bound.texture[i % 10],
        i * w,
        H * (1 + ratio / 2),
        w + 1,
        H * invRatio
      );
    }
  }
}
