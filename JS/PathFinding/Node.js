class Node {
  constructor(i, j) {
    this.i = i;
    this.j = j;

    this.g = 0;
    this.h = 0;
    this.f;

    this.neighbors = [];

    this.prev;

    this.wall = random(0, 1) > 0.6 ? true : false;
  }

  addNeighbors(...neighbors) {
    for (let neighbor of neighbors) if (neighbor) this.neighbors.push(neighbor);
  }

  coords() {
    return [this.j * scaleRow + scaleRow / 2, this.i * scaleCol + scaleCol / 2];
  }

  show(color = 255) {
    noStroke();
    fill(this.wall ? 0 : color);
    ellipse(...this.coords(), scaleCol, scaleRow);
  }
}
