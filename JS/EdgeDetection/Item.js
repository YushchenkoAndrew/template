class Item {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.w = (MENU_SIZE / 2) * name.length;
    this.name = name;
    this.enable = true;
    this.complete = false;
  }

  changeOption(x, y) {
    if (this.y < y || this.y - MENU_SIZE > y || this.x > x || this.x + this.w < x) return;

    this.enable ^= true;
    return true;
  }

  setData(data = {}) {
    this.data = {};
    Object.setPrototypeOf(this.data, data);
  }

  showData(x, y) {
    if (this.y < y || this.y - MENU_SIZE > y || this.x > x || this.x + this.w < x) return;

    console.log("Yo Data!!");
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

    noFill();
    stroke(255);
    rect(this.x, this.y - MENU_SIZE, this.w, MENU_SIZE);
  }
}
