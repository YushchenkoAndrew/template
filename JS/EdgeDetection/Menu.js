class Menu {
  constructor(...items) {
    this.items = [];
    this.enable = true;
    this.menuButt = { x: 10, y: 10, w: 30, h: 30 };
    this.index = -1;

    textSize(MENU_SIZE);

    let step = H / items.length;
    for (let i in items) this.items[i] = new Item(50, step * i + step / 2, items[i]);

    console.log(this.items);
  }

  setOptions(...options) {
    this.func = options;
  }

  enableOption(x, y) {
    for (var i in this.items) if (this.items[i].changeOption(x, y)) break;

    return i == this.items.length - 1;
  }

  runNextOption() {
    if (++this.index == this.func.length - 1) {
      this.reset();
      this.func[this.index](); // Reset Image
      this.index = -1;
      return;
    }

    if (!this.items[this.index].enable && this.refreshMenuBar()) return;
    this.func[this.index]();
    this.items[this.index].complete = true;

    this.refreshMenuBar();
  }

  refreshMenuBar() {
    let menuW = H / 2 + this.items[0].x;
    updatePixels(0, 0, menuW, H);

    noStroke();
    fill(0, 100);
    if (!this.enable) rect(0, 0, menuW, H);
    return true;
  }

  reset() {
    for (var i in this.items) this.items[i].reset();
  }

  setAdditionalData(index, data) {
    this.items[index].setData(data);
  }

  showData(x, y) {
    for (var i in this.items) if (this.items[i].data && this.items[i].showData(x, y)) break;

    // if (i == this.items.length - 1) this.refreshMenuBar();
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

  show() {
    noStroke();
    fill(0, 100);
    let { x, y, w, h } = this.menuButt;
    let menuW = H / 2 + this.items[0].x;

    if ((mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) || !this.enable) {
      if (this.enable) rect(0, 0, menuW, H);

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
