// Source: https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode

class PathFinding {
  constructor(start = { i: 0, j: 0 }, goal = { i: 1, j: 1 }) {
    this.grid = [];
    this.path = [];

    for (let i = 0; i < row; i++) {
      this.grid.push([]);
      for (let j = 0; j < col; j++) {
        this.grid[i][j] = new Node(i, j);
      }
    }

    this.initializeNeighbors();

    this.end = this.grid[goal.i][goal.j];
    this.end.wall = false;

    this.start = this.grid[start.i][start.j];
    this.start.g = 0;
    this.start.wall = false;

    this.openSet = [this.start];
    this.closeSet = [];
  }

  initializeNeighbors() {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        this.grid[i][j].addNeighbors(
          check.call(this, i - 1, j),
          check.call(this, i + 1, j),
          check.call(this, i, j - 1),
          check.call(this, i, j + 1)
          // check.call(this, i - 1, j - 1),
          // check.call(this, i + 1, j - 1),
          // check.call(this, i - 1, j + 1),
          // check.call(this, i + 1, j + 1)
        );
      }
    }

    function check(i, j) {
      if (this.grid[i]) if (this.grid[i][j]) return this.grid[i][j];
    }
  }

  loadMap(map) {
    let keys = ["Up", "Left"];

    for (let cell of map) {
      for (let i of keys) {
        if (cell.walls[i].isFree) {
          let y = i.includes("Left");
          let x = i.includes("Up");

          for (let k = 0; k <= div; k++) {
            let i = cell.i * div + y * k;
            let j = cell.j * div + x * k;

            if (this.grid[i]) if (this.grid[i][j]) this.grid[i][j].wall = true;
          }
        }
      }
    }
  }

  findLowest_fScore() {
    let index = 0;

    for (let i = 0; i < this.openSet.length; i++) {
      if (this.openSet[i].f < this.openSet[index].f) index = i;
    }

    return index;
  }

  update() {
    if (this.openSet.length == 0) return true;

    let index = this.findLowest_fScore();

    let current = this.openSet[index];

    if (current == this.end) {
      this.openSet = [];

      this.path = [];
      this.path = this.reconstructPath(current);
      return true;
    }

    this.closeSet.push(current);
    this.openSet.splice(index, 1);

    // console.log(current.neighbors);

    for (let neighbor of current.neighbors) {
      if (neighbor.wall || this.closeSet.includes(neighbor)) continue;

      let tentative_gScore = current.g + 1;

      if (this.openSet.includes(neighbor) && tentative_gScore >= neighbor.g)
        continue;

      neighbor.g = tentative_gScore;
      neighbor.h = this.h(neighbor, this.end);
      neighbor.f = neighbor.g + neighbor.h;

      neighbor.prev = current;

      if (!this.openSet.includes(neighbor)) this.openSet.push(neighbor);
    }

    this.path = [];
    this.path = this.reconstructPath(current);
  }

  h(a, b) {
    return dist(a.i, a.j, b.i, b.j);
    // return abs(a.i - a.j) + abs(b.i - b.j);
  }

  reconstructPath(current) {
    if (current.prev) return [...this.reconstructPath(current.prev), current];

    return [current];
  }

  show() {
    // for (let i = 0; i < row; i++) {
    //   for (let j = 0; j < col; j++) this.grid[i][j].show();
    // }

    // this.showOpenSet();
    // this.showCloseSet();
    this.showPath();
  }

  showOpenSet() {
    for (let node of this.openSet) {
      node.show(color(0, 255, 0));
    }
  }

  showCloseSet() {
    for (let node of this.closeSet) {
      node.show(color(255, 0, 0));
    }
  }

  showPath() {
    noFill();
    strokeWeight(scaleRow / 2);
    stroke(250, 20, 150);
    beginShape();
    for (let node of this.path) {
      // node.show(color(0, 0, 255));
      vertex(...node.coords(0));
    }
    endShape();

    strokeWeight(1);
  }
}
