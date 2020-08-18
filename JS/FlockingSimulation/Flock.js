// Source: https://www.red3d.com/cwr/boids/
//         https://natureofcode.com/book/chapter-6-autonomous-agents/

class Flock {
  constructor(n = 1) {
    this.flock = [];
    this.qTree = new QuadTree(FRAME, 5);

    for (let i = 0; i < n; i++) {
      let bird = new Bird();
      this.flock.push(bird);
      this.qTree.add(bird);
    }
  }

  update() {
    // Create new QuadTree
    let qTree = new QuadTree(FRAME, 5);

    // let copy = [];
    // Change Position
    for (let i = 0; i < this.flock.length; i++) {
      let { x, y } = this.flock[i].pos;
      let r = this.flock[i].range;

      let range = new Rectangle(x - r, y - r, 2 * r, 2 * r);
      // // range.show(color(0, 255, 0));

      let points = [...this.qTree.getPoints(range)];

      let cohesion = createVector(0, 0);
      let alignment = createVector(0, 0);
      let separation = createVector(0, 0);

      for (let i = 0; i < points.length; i++)
        if (points[i] != this.flock[i]) {
          cohesion.add(points[i].pos);
          alignment.add(points[i].vel);

          let temp = p5.Vector.sub(points[i].pos, this.flock[i].pos);
          temp.div(temp.mag());

          separation.add(temp);
        }

      cohesion.div(points.length || 1);
      cohesion.sub(this.flock[i].pos);

      alignment.div(points.length || 1);

      // separation.div(points.length);
      // separation.mult(-1);

      this.flock[i].applyBehavior(cohesion, 0);
      this.flock[i].applyBehavior(alignment, 1);
      this.flock[i].applyBehavior(separation, 2);

      qTree.add(this.flock[i]);
    }

    this.qTree = qTree;
  }

  show() {
    for (let i in this.flock) {
      this.flock[i].show();
      this.flock[i].move();
    }

    // this.qTree.show(false);
  }
}
