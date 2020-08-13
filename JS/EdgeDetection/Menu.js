class Menu {
  constructor(...items) {
    this.items = [];

    textSize(MENU_SIZE);

    let step = H / items.length;
    for (let i in items) this.items[i] = new Item(50, step * i + step / 2, items[i]);

    console.log(this.items);
  }

  choseOption(x, y) {
    for (var i in this.items) if (this.items[i].changeOption(x, y)) break;

    return i == this.items.length - 1;
  }

  reset() {
    for (var i in this.items) this.items[i].reset();
  }

  showData(x, y) {
    for (var i in this.items) if (this.items[i].showData(x, y)) break;
  }

  show() {
    for (let i in this.items) this.items[i].show();
  }
}
