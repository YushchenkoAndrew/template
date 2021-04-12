function Branch(begin, end) {
  // Coord of vector
  this.begin = begin;
  this.end = end;
  this.finished = false;
  this.leaves = [];

  // Save value end for correct jitter
  this.coords = end.copy();

  this.show = function (dx) {
    stroke(255);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);

    for (let i = this.leaves.length - 1; i >= 0; i--) {
      this.leaves[i].show(dx);
      if (this.leaves[i].coord.y > 800) {
        this.leaves.splice(i, 1);
      }
    }
  };

  this.jitter = function (dx, level) {
    this.end.x = -2.5 * level + noise(dx) * 5 * level + this.coords.x;
  };

  this.branch = function () {
    this.finished = true;
    angle = random(PI / 32, PI / 3);

    let right = p5.Vector.sub(this.end, this.begin);
    let left = p5.Vector.sub(this.end, this.begin);

    function createBranch(branch, angleDir) {
      branch.mult(random(0.6, 0.8));
      branch.rotate(random(PI / 32, PI / 3) * angleDir);
      branch = p5.Vector.add(this.end, branch);

      let newBranch = new Branch(this.end, branch);

      if (branch.mag() < 4) {
        newBranch.finished = true;
      }
      return newBranch;
    }

    return [createBranch.call(this, right, 1), createBranch.call(this, left, -1)];
  };

  this.leaf = function () {
    this.leaves.push(new Leaf(this.end.copy(), 15, 0));
  };
}
