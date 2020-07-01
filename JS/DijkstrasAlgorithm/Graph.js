class Graph {
  constructor(matrix, x, y) {
    this.matrix = matrix;

    this.x = x;
    this.y = y;
    this.r = 25;

    this.pos = [];

    for (let i in this.matrix)
      this.pos.push({
        x: this.x + step * i,
        y: this.y + random(-5, 5) * step,
      });
  }

  show() {
    stroke(255);

    for (let i in this.matrix) {
      for (let j in this.matrix) {
        if (this.matrix[i][j] != 0)
          line(this.pos[i].x, this.pos[i].y, this.pos[j].x, this.pos[j].y);
      }
    }

    for (let i in this.pos) {
      ellipse(this.pos[i].x, this.pos[i].y, this.r);
      text(i, this.pos[i].x - this.r / 4, this.pos[i].y + this.r / 4);
    }
  }
}
