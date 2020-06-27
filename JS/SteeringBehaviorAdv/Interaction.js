class Interaction {
  constructor(size) {
    this.qTree = new QuadTree(
      new Rectangle(shift.x, shift.y, img.width, img.height),
      10
    );
    this.circles = [];

    for (let i = 0; i < size; i++) {
      let x = floor(random(0, W));
      let y = floor(random(0, H));

      let circle = new Circle(x, y, i, getPixelColor(x, y));

      this.circles.push(circle);
      this.qTree.add(circle);
    }
  }

  grow(i) {
    const circle = this.circles[i];
    const r = circle.r * 2;

    const range = new Rectangle(circle.x - r, circle.y - r, r * 2, r * 2);
    if (showGrid) range.show(color(0, 255, 0));

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

  placeIsFree(x, y) {
    const range = new Rectangle(x - len / 2, y - len / 2, len, len);

    const closest = [...this.qTree.getPoints(range)];
    for (let cl of closest) {
      if (dist(x, y, cl.x, cl.y) <= cl.r + freeRange) {
        return false;
      }
    }
    return true;
  }

  rebuildTree() {
    this.qTree = new QuadTree(
      new Rectangle(shift.x, shift.y, img.width, img.height),
      10
    );

    for (let circle of this.circles) this.qTree.add(circle);
  }

  removeNotFitCircle() {
    this.circles = [...this.qTree.getPoints(range)];

    this.qTree = new QuadTree(
      new Rectangle(shift.x, shift.y, img.width, img.height),
      10
    );

    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].index = i;
      this.qTree.add(this.circles[i]);
    }
  }

  show() {
    if (showGrid) this.qTree.show();

    this.rebuildTree();
    this.removeNotFitCircle();

    for (let i = 0; i < this.circles.length; i++) {
      this.grow(i);
      this.circles[i].show();
    }
  }
}
