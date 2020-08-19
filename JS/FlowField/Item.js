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
    this.data.min = [];
    this.data.max = [];

    let step = this.w / this.data.value.length;
    for (let i = 0; i < this.data.value.length; i++) {
      let w_ = (MENU_SIZE / 2) * this.data.value[i].toFixed(2).length + step * i;

      this.data.min[i] = { x: this.x + w_, y: this.y - 50 - MENU_SIZE, w: MENU_SIZE / 2, h: MENU_SIZE };
      this.data.max[i] = { x: this.x + w_ + MENU_SIZE / 2, y: this.y - 50 - MENU_SIZE, w: MENU_SIZE / 2, h: MENU_SIZE };
    }
  }

  showData(x_, y_, enable) {
    if (!enable && (this.y < y_ || this.y - MENU_SIZE > y_ || this.x > x_ || this.x + this.w < x_)) return;

    let step = this.w / this.data.value.length;
    for (let i = 0; i < this.data.value.length; i++) {
      stroke(0);
      fill(255);

      text(this.data.value[i].toFixed(2), this.x + step * i, this.y - 50);
      // let w_ = (MENU_SIZE / 2) * (this.data.value[i] + "").length;

      fill(192, 57, 43);
      text("<", this.data.min[i].x, this.data.min[i].y + MENU_SIZE);

      fill(100, 255, 20);
      text(">", this.data.max[i].x, this.data.max[i].y + MENU_SIZE);
    }
    return true;
  }

  changeData(x_, y_) {
    for (var i = 0; i < this.data.value.length; i++) {
      let { y, w, h } = this.data.min[i];
      let minX = this.data.min[i].x;
      let maxX = this.data.max[i].x;

      if (y < y_ && y + h > y_) {
        let sign = minX < x_ && minX + w > x_ ? -1 : 0;
        sign = maxX < x_ && maxX + w > x_ ? 1 : sign;

        this.data.value[i] += this.data.step * sign;

        if (sign) break;
      }
    }

    return !(i == this.data.value.length);
  }

  reset() {
    this.complete = false;
  }

  show(reset) {
    noStroke();
    let color = this.complete ? [100, 255, 20] : [192, 57, 43];
    color = this.enable ? color : [100];
    color = reset ? [255] : color;
    fill(...color);
    textSize(MENU_SIZE);

    text(this.name, this.x, this.y);

    // Reset changes
    textSize(12);

    // noFill();
    // stroke(255);
    // rect(this.x, this.y - MENU_SIZE, this.w, MENU_SIZE);
  }
}
