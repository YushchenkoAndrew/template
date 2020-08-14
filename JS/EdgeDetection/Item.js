class Item {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.w = (MENU_SIZE / 2) * name.length;
    this.name = name;
    this.enable = true;
    this.complete = false;
  }

  getCoords() {
    return { x: this.x, y: this.y };
  }

  changeOption(x, y) {
    if (this.y < y || this.y - MENU_SIZE > y || this.x > x || this.x + this.w < x) return;

    this.enable ^= true;
    return true;
  }

  setData(data) {
    this.data = {};
    Object.setPrototypeOf(this.data, data);
  }

  showData(x, y) {
    if (this.y < y || this.y - MENU_SIZE > y || this.x > x || this.x + this.w < x) return;

    // fill(150, 0, 250, 100);
    // rect(this.x, this.y, this.w, 100);

    let step = this.w / this.data.value.length;
    for (let i = 0; i < this.data.value.length; i++) {
      noStroke();
      fill(164, 34, 250);
      text(this.data.value[i], this.x + 10 + step * i, this.y - 50);
      let w_ = (MENU_SIZE / 2) * (this.data.value[i] + "").length;

      fill(192, 57, 43);
      text("<", this.x + 10 + step * i + w_, this.y - 50);

      fill(100, 255, 20);
      text(">", this.x + 10 + step * i + w_ + MENU_SIZE / 2, this.y - 50);

      stroke(255);
      noFill();
      rect(this.x + 10 + step * i + w_, this.y - 50 - MENU_SIZE, MENU_SIZE / 2, MENU_SIZE);
      rect(this.x + 10 + step * i + w_ + MENU_SIZE / 2, this.y - 50 - MENU_SIZE, MENU_SIZE / 2, MENU_SIZE);
    }
    // console.log("Yo Data!!");
    return true;
  }

  reset() {
    this.complete = false;
  }

  show() {
    noStroke();
    let color = this.complete ? [100, 255, 20] : [192, 57, 43];
    color = this.enable ? color : [100];
    fill(...color);

    text(this.name, this.x, this.y);

    // noFill();
    // stroke(255);
    // rect(this.x, this.y - MENU_SIZE, this.w, MENU_SIZE);
  }
}
