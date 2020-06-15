function Leaf(coord, size, xoff) {
  this.coord = coord;
  this.size = size;
  this.xoff = xoff;

  this.show = function () {
    fill(150, 0, 100, 200);
    noStroke();
    this.coord.y += 0.5;
    this.xoff += 0.01;

    this.coord.x += -5 + noise(this.xoff) * 10;
    ellipse(this.coord.x, this.coord.y, this.size, this.size);
  };

  this.get_xoff = function () {
    return this.xoff;
  };
}
