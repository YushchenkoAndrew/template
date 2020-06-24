class Interaction {
  constructor(size) {
    this.qTree = new QuadTree(new Rectangle(0, 0, W, H));
    this.circles = [];

    for (let i = 0; i < size; i++) {
      let x = random(0, W);
      let y = random(0, H);

      let circle = new Circle(x, y, i);

      this.circles.push(circle);
      this.qTree.add(circle);
    }
  }

  grow(i) {
    const circle = this.circles[i];
    const r = circle.r * 2;

    const range = new Rectangle(circle.x - r, circle.y - r, r * 2, r * 2);
    range.show(color(0, 255, 0));

    const closest = [...this.qTree.getPoints(range)];

    for (let cl of closest) {
      if (cl.index == i) {
        continue;
      }

      if (dist(circle.x, circle.y, cl.x, cl.y) <= cl.r + circle.r) {
        this.circles[cl.index].growing = false;
        this.circles[i].growing = false;
      }
    }

    this.circles[i].grow();
  }

  rebuildTree() {
    this.qTree = new QuadTree(new Rectangle(0, 0, W, H));

    for (let circle of this.circles) this.qTree.add(circle);
  }

  show() {
    this.qTree.show();

    this.rebuildTree();

    for (let i = 0; i < this.circles.length; i++) {
      this.grow(i);
      this.circles[i].show();
    }
  }
}
