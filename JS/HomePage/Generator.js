// Algorithm: Recursive backtracker
// Resource: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker

class Generator {
  constructor() {
    this.grid = [];
    this.stack = [];

    this.row = Math.floor(MazeCanvas.height / step);
    this.col = Math.floor(MazeCanvas.width / step);

    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) this.grid.push(new Cell(i, j));
    }

    this.current = this.grid[0];
    this.current.visited = true;
    this.stack.push(this.current);
  }

  index(i, j) {
    if (j < 0 || i < 0 || i > this.row - 1 || j > this.col - 1) return -1;

    return j + i * this.col;
  }

  checkNeighbors(i, j) {
    let up = this.grid[this.index(i - 1, j)];
    let down = this.grid[this.index(i + 1, j)];
    let left = this.grid[this.index(i, j - 1)];
    let right = this.grid[this.index(i, j + 1)];

    let unvisited = check(up, down, left, right);
    let index = Math.floor(Math.random() * unvisited.length);

    // console.log(unvisited);

    return unvisited[index];

    function check(...cells) {
      return cells.filter((cell) => cell && !cell.visited);
    }
  }

  move() {
    let { i, j } = this.current;
    // let i = this.current.i;
    // let j = this.current.j;

    this.current.isCurrent = false;

    let next = this.checkNeighbors(i, j);

    // console.log(next);

    if (this.stack.length == 0) return;

    if (next) {
      this.removeWall(this.current, next);
      this.stack.push(this.current);

      this.current = next;
    } else this.current = this.stack.pop();

    this.current.isCurrent = true;
    this.current.visited = true;
  }

  removeWall(curr, next) {
    let dy = next.i - curr.i;
    let dx = next.j - curr.j;

    if (Math.abs(dy) == 1) {
      curr.walls[dy == 1 ? "Down" : "Up"].isFree = false;
      next.walls[dy == 1 ? "Up" : "Down"].isFree = false;
      return;
    }

    curr.walls[dx == 1 ? "Right" : "Left"].isFree = false;
    next.walls[dx == 1 ? "Left" : "Right"].isFree = false;
  }

  show() {
    for (let i in this.grid) this.grid[i].show();
  }
}
