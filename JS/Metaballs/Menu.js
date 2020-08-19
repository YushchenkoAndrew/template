class Menu {
  constructor(...items) {
    this.items = [];
    this.enable = true;
    this.menuButt = { x: 10, y: 10, w: 30, h: 30 };
    this.index = -1;
    this.inTheRange = false;

    let step = H / items.length;
    for (let i in items) this.items[i] = new Item(50, step * i + step / 2, items[i]);

    console.log(this.items);
  }

  setOptions(...options) {
    this.func = options;
  }

  enableOption(x, y, changeOption) {
    for (var i = 0; i < this.items.length; i++) if (this.items[i].changeOption(x, y)) break;

    if (changeOption && i != this.items.length) this.func[i]();

    return i == this.items.length;
  }

  runNextOption() {
    if (++this.index == this.func.length - 1) {
      this.reset();
      this.func[this.index](); // Reset Image
      this.refreshMenuBar();
      this.index = -1;
      return;
    }

    if (!this.items[this.index].enable && this.refreshMenuBar()) return;

    let data = this.items[this.index].data ? this.items[this.index].data.value : [];
    this.func[this.index](...data);
    this.items[this.index].complete = true;

    this.refreshMenuBar();
  }

  refreshMenuBar() {
    let menuW = H / 2 + this.items[0].x;
    updatePixels(0, 0, menuW, H);

    noStroke();
    fill(0, 100);
    if (!this.enable) rect(0, 0, menuW, H);
    for (let i in this.items) this.items[i].show();

    return true;
  }

  reset() {
    for (var i in this.items) this.items[i].reset();
  }

  setAdditionalData(index, data) {
    this.items[index].setData(data);
  }

  showData(x_, y_) {
    let checkRange = InRange.bind(this);

    for (var i = 0; i < this.items.length; i++) if (this.items[i].data && this.items[i].showData(x_, y_, this.inTheRange && checkRange(i, x_, y_))) break;

    this.inTheRange |= i != this.items.length;

    if (this.inTheRange) {
      this.inTheRange &= checkRange(i, x_, y_);
      if (this.inTheRange) return;

      this.refreshMenuBar();
    }

    function InRange(i, x_, y_) {
      let { x, y } = this.items[i - 1] || { x: 0, y: 0 };
      let { w } = this.items[i] || 0;
      let h = (this.items[i] ? this.items[i].y : y) - y;

      return x < x_ && x + w > x_ && y < y_ && y + h > y_;
    }
  }

  completeAll() {
    for (let i in this.items) this.items[i].complete = true;
  }

  changeItemData(x, y) {
    for (var i = 0; i < this.items.length; i++) if (this.items[i].data && this.items[i].changeData(x, y)) break;

    if (i != this.items.length) this.refreshMenuBar();

    return i == this.items.length;
  }

  IsEnable() {
    return !this.enable;
  }

  showMenuIcon() {
    let { x, y, w, h } = this.menuButt;
    stroke(0);
    fill(255);
    rect(x, y, w, h / 6, h / 5);
    rect(x, y + (2 * h) / 5, w, h / 6, h / 5);
    rect(x, y + (4 * h) / 5, w, h / 6, h / 5);
  }

  show(skip = false) {
    noStroke();
    fill(0, 100);
    let { x, y, w, h } = this.menuButt;
    let menuW = H / 2 + this.items[0].x;

    if ((mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) || !this.enable) {
      if (this.enable || skip) rect(0, 0, menuW, H);

      for (let i in this.items) this.items[i].show();

      if (this.index != -1) {
        let pos = this.items[this.index].getCoords();

        fill(255);
        ellipse(pos.x - MENU_SIZE / 2, pos.y - MENU_SIZE / 2, 7);
      }

      this.showData(mouseX, mouseY);
      this.showMenuIcon();
      this.enable = !(mouseX < menuW);
      return;
    }

    this.enable = true;
    updatePixels(0, 0, menuW, H);
    this.showMenuIcon();
  }
}
