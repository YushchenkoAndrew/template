// Source:  http://karlsims.com/rd.html

class Diffusion {
  constructor() {
    this.width = Math.floor(W / step);
    this.height = Math.floor(H / step);

    // Some typical values
    this.diffusion = { a: 1.0, b: 0.5 };
    this.feed = 0.055;
    this.kill = 0.062;
    this.weight = [
      [0.05, 0.2, 0.05],
      [0.2, -1, 0.2],
      [0.05, 0.2, 0.05],
    ];

    this.curr = [];
    this.next = [];

    for (let i = 0; i < this.height; i++) {
      this.curr.push([]);
      this.next.push([]);
      for (let j = 0; j < this.width; j++) {
        this.curr[i][j] = { a: 1, b: 0 };
        this.next[i][j] = { a: 1, b: 0 };
      }
    }

    let x = Math.floor(this.width / 2) - 5;
    let y = Math.floor(this.height / 2) - 5;
    this.addChemical(x, y, 10);
  }

  addChemical(x, y, range = 10) {
    for (let i = 0; i < range; i++) for (let j = 0; j < range; j++) this.curr[y + i][x + j].b = 1;
  }

  update(i, j) {
    if (i == 0 || j == 0 || i == this.width - 1 || j == this.height - 1) return;

    let { a, b } = this.curr[i][j];

    let lap = this.LaplacianFunc(int(j), int(i));

    this.next[i][j].a = a + (this.diffusion.a * lap.a - a * b * b + this.feed * (1 - a));
    this.next[i][j].b = b + (this.diffusion.b * lap.b + a * b * b - (this.kill + this.feed) * b);
  }

  LaplacianFunc(x, y) {
    let a = 0;
    let b = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        a += this.curr[i + y][j + x].a * this.weight[i + 1][j + 1];
        b += this.curr[i + y][j + x].b * this.weight[i + 1][j + 1];
      }
    }
    return { a, b };
  }

  show() {
    noStroke();

    for (let i in this.curr)
      for (let j in this.curr) {
        this.update(i, j);

        let { a, b } = this.next[i][j];
        let color = Math.floor((a - b) * 255);

        fill(color);
        rect(j * step, i * step, step, step);
      }

    this.swap();
  }

  swap() {
    let temp = this.curr;
    this.curr = this.next;
    this.next = temp;
  }
}
