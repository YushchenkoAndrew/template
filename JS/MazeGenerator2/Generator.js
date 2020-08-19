// Algorithm: Recursive division method
// Resource: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method

class Generator {
  constructor(chamber) {
    this.chamber = chamber;

    this.divide = false;

    let template = {
      divide: false,
      setValue(val) {
        this.value = val;
        this.divide = true;
      },
    };

    this.index = 0;
    this.keys = ["NW", "NE", "SW", "SE"];
    this.chambers = { NW: {}, NE: {}, SW: {}, SE: {} };

    for (let i in this.chambers) {
      Object.setPrototypeOf(this.chambers[i], template);
    }
  }

  subDivide() {
    if (this.chamber.w - step < step || this.chamber.h - step < step) return;

    let dx = Math.floor(random(1, Math.floor(this.chamber.w / step - 1))) * step;
    let dy = Math.floor(random(1, Math.floor(this.chamber.h / step - 1))) * step;

    let w = this.chamber.w - dx;
    let h = this.chamber.h - dy;

    let x = this.chamber.x + dx;
    let y = this.chamber.y + dy;

    let holes = this.generateHoles(x, y, w, h);

    let nw = new Chamber(this.chamber.x, this.chamber.y, dx, dy, {
      type: "NW",
      Down: holes[0],
      Right: holes[2],
    });
    let ne = new Chamber(x, this.chamber.y, w, dy, {
      type: "NE",
      Down: holes[1],
      Left: holes[2],
    });
    let sw = new Chamber(this.chamber.x, y, dx, h, {
      type: "SW",
      Up: holes[0],
      Right: holes[3],
    });
    let se = new Chamber(x, y, w, h, {
      type: "SE",
      Up: holes[1],
      Left: holes[3],
    });

    this.chambers["NW"].setValue(new Generator(nw));
    this.chambers["NE"].setValue(new Generator(ne));
    this.chambers["SW"].setValue(new Generator(sw));
    this.chambers["SE"].setValue(new Generator(se));

    this.divide = true;

    return true;
  }

  generateHoles(x, y, w, h) {
    let holes = [];

    // Set hole in range (x, x + dx)
    holes.push(random(this.chamber.x / step, x / step));
    // Set hole in range (x + dx, x + dx + w)
    holes.push(random(x / step, (this.chamber.x + this.chamber.w) / step));
    // Set hole in range (y, y + dy)
    holes.push(random(this.chamber.y / step, y / step));
    // Set hole in range (y + dy, y + dy + h)
    holes.push(random(y / step, (y + h) / step));

    for (let i in holes) holes[i] = Math.floor(holes[i]) * step;

    // Delete one
    holes[Math.floor(random(0, holes.length))] = undefined;

    return holes;
  }

  update() {
    if (!this.divide) return this.subDivide();

    if (this.keys[this.index] && this.chambers[this.keys[this.index]].divide && !this.chambers[this.keys[this.index]].value.update()) {
      for (var i = this.index + 1; i < this.keys.length; i++) if (this.chambers[this.keys[i]].divide) break;

      this.index = i;
    }

    return this.keys[this.index];
  }

  show() {
    this.chamber.show();

    for (let i in this.chambers) if (this.chambers[i].divide) this.chambers[i].value.show();
  }
}
