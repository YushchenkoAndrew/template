class Generator {
  constructor(chamber) {
    this.chamber = chamber;

    this.divide = false;

    let temp = {
      divide: false,
      setValue(val) {
        this.value = val;
        this.divide = true;
      },
    };

    this.chambers = { NW: {}, NE: {}, SW: {}, SE: {} };

    for (let i in this.chambers) {
      Object.setPrototypeOf(this.chambers[i], temp);
    }
  }

  subDivide() {
    let dx = Math.floor(random(step, this.chamber.w - step));
    let dy = Math.floor(random(step, this.chamber.h - step));

    let w = this.chamber.w - dx;
    let h = this.chamber.h - dy;

    let x = this.chamber.x + dx;
    let y = this.chamber.y + dy;

    let nw = new Chamber(this.chamber.x, this.chamber.y, dx, dy);
    let ne = new Chamber(x, this.chamber.y, w, dy);
    let sw = new Chamber(this.chamber.x, y, dx, h);
    let se = new Chamber(x, y, w, h);

    if (dx >= step && dy >= step)
      this.chambers["NW"].setValue(new Generator(nw));

    if (w >= step && dy >= step)
      this.chambers["NE"].setValue(new Generator(ne));

    if (dx >= step && h >= step)
      this.chambers["SW"].setValue(new Generator(sw));

    if (w >= step && h >= step) this.chambers["SE"].setValue(new Generator(se));

    this.divide = true;
  }

  update() {
    if (!this.divide) {
      this.subDivide();
    }

    for (let i in this.chambers)
      if (this.chambers[i].divide) this.chambers[i].value.update();
  }

  show() {
    this.chamber.show();

    for (let i in this.chambers)
      if (this.chambers[i].divide) this.chambers[i].value.show();
  }
}
