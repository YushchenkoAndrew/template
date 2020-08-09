class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;

    this.isCurrent = true;
    this.defaultColor = body.color(150, 0, 250, 100);
    this.highlightColor = body.color(100, 250, 0, 150);

    let x = this.j * step;
    let y = this.i * step;
    let dx = x + step;
    let dy = y + step;

    this.visited = false;
    this.walls = {
      Up: {
        isFree: true,
        value: [x, y, dx, y],
      },
      Down: {
        isFree: true,
        value: [x, dy, dx, dy],
      },
      Left: {
        isFree: true,
        value: [x, y, x, dy],
      },
      Right: {
        isFree: true,
        value: [dx, y, dx, dy],
      },
    };
  }

  show() {
    if (this.visited) {
      body.noStroke();
      body.fill(this.isCurrent ? this.highlightColor : this.defaultColor);
      body.rect(this.j * step, this.i * step, step, step);
    }

    body.stroke(255);
    for (let i in this.walls) if (this.walls[i].isFree) body.line(...this.walls[i].value);
  }
}
