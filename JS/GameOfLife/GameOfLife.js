class GameOfLife {
  constructor() {
    this.curr = [];
    this.aliveCells = [];

    this.pause = false;
    this.pattern = {};
    this.off = (index, border) => index + (index >= 0 && index < border ? 0 : -border * Math.sign(index));

    this.h = Math.floor(H / step);
    this.w = Math.floor(W / step);

    for (let i = 0; i < this.h; i++)
      for (let j = 0; j < this.w; j++) {
        this.curr.push(Math.floor(Math.random() + 0.5));
        if (this.curr[i * this.w + j]) this.aliveCells.push({ x: j * step, y: i * step });
      }
  }

  createLive({ x, y }) {
    // $.terminal.active().echo(`${outputSign}\t\t ${x} ${y}`);
    this.curr[y * this.w + x] ^= 1;

    if (this.curr[y * this.w + x]) this.aliveCells.push({ x: x * step, y: y * step });
    else {
      x *= step;
      y *= step;

      // $.terminal.active().echo(`${outputSign}\t\t ${this.aliveCells.findIndex((cell) => cell.x == x && cell.y == y)}`);
      this.aliveCells.splice(
        this.aliveCells.findIndex((cell) => cell.x == x && cell.y == y),
        1
      );
    }
  }

  greatFlood() {
    this.aliveCells = [];

    for (let i in this.curr) this.curr[i] &= 0;
  }

  handOfGod(name, insert = false) {
    if (this.pattern.name != name) {
      $.getJSON("Patterns.json", (patterns) => {
        if (patterns[name]) Object.setPrototypeOf(game.pattern, { name: name, show: showPattern.bind(game, patterns[name]) });
        else Object.setPrototypeOf(game.pattern, { name: name, show: () => {} });
      });
      this.pattern.name = name;
      return;
    }

    // Waiting...
    if (!this.pattern.show) return;

    this.pattern.show(insert);

    function showPattern(pattern, insert) {
      if (mouseX > W || mouseX < 0 || mouseY > H || mouseY < 0) return;

      let x = Math.floor(mouseX / step);
      let y = Math.floor(mouseY / step);

      fill(120);
      for (let i in pattern) {
        rect(this.off(x + pattern[i].j, this.w) * step, this.off(y + pattern[i].i, this.h) * step, step);

        if (insert) this.createLive({ x: this.off(x + pattern[i].j, this.w), y: this.off(y + pattern[i].i, this.h) });
      }
    }
  }

  nextGeneration() {
    if (this.pause) return;

    let next = [];
    this.aliveCells = [];

    for (let i = 0; i < this.h; i++)
      for (let j = 0; j < this.w; j++) {
        const index = i * this.w + j;

        let sum = -this.curr[index];
        for (let x = -1; x < 2; x++) for (let y = -1; y < 2; y++) sum += this.curr[this.off(i + y, this.h) * this.w + this.off(j + x, this.w)] ? 1 : 0;

        // Kill Cell
        next[index] = sum < 2 || sum > 3 ? 0 : this.curr[index];
        // Reproduce Cell
        next[index] = !this.curr[index] && sum == 3 ? 1 : next[index];

        if (next[index]) this.aliveCells.push({ x: j * step, y: i * step });
      }

    this.curr = next;
  }

  showGrid() {
    stroke(150);
    strokeWeight(0.5);

    for (let i = 0; i < H / step; i++) line(0, i * step, W, i * step);
    for (let i = 0; i < W / step; i++) line(i * step, 0, i * step, H);
    line(0, H, W, H);
    line(W, 0, W, H);
  }

  show() {
    fill(0);
    noStroke();

    for (let i = 0; i < this.aliveCells.length; i++) rect(this.aliveCells[i].x, this.aliveCells[i].y, step);

    this.showGrid();
  }
}
