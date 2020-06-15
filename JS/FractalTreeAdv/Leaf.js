function Leaf(coord, size, xoff) {
  this.coord = coord;
  this.size = size;
  this.step = random(0.1, 1.1);

  this.show = function (dx) {
    fill(150, 0, 100, 200);
    noStroke();
    this.coord.y += this.step;

    this.coord.x += -5 + noise(dx) * 10;
    ellipse(this.coord.x, this.coord.y, this.size, this.size);
  };

  this.get_xoff = function () {
    return this.xoff;
  };
}
