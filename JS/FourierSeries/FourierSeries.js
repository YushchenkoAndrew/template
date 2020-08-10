// Source:  https://en.wikipedia.org/wiki/Fourier_series#Convergence

class FourierSeries {
  constructor(offset, i, len, n = 0) {
    this.offset = offset;
    this.r = R / (n + 1);
    this.color = color(n, 255, 255);
    this.stackIndex = i;

    this.vect = createVector(this.r, 0);
    this.angle = 0;
    this.step = -0.01 * (n + 1);

    if (n < len) this.next = new FourierSeries(p5.Vector.add(this.offset, this.vect), i, len, n + 2);
  }

  update(newOffset) {
    this.vect.x = this.r * Math.cos(this.angle);
    this.vect.y = this.r * Math.sin(this.angle);

    this.angle += this.step;

    if (newOffset) this.offset = newOffset;

    if (this.next) this.next.update(p5.Vector.add(this.offset, this.vect));
  }

  drawGraph() {
    fill(this.color);
    strokeWeight(2);

    let { x, y } = p5.Vector.add(this.offset, this.vect);
    let j = this.stackIndex;

    line(x, y, GRAPH_X, y);
    ellipse(x, y, 5);
    ellipse(GRAPH_X, y, 5);

    if (frameCount % 5 == 0) stack[j].push(createVector(GRAPH_X, y));

    for (let i = stack[j].length - 1; i > 0; i--) {
      if (stack[j][i].x + 0.5 > W) {
        stack[j].splice(i, 1);
        continue;
      }

      stack[j][i].x += 0.5;
      line(stack[j][i - 1].x, stack[j][i - 1].y, stack[j][i].x, stack[j][i].y);
    }
    if (stack[j][0]) stack[j][0].x += 0.5;
  }

  show() {
    noFill();
    stroke(this.color);
    strokeWeight(1);

    ellipse(this.offset.x, this.offset.y, this.r * 2);

    let { x, y } = p5.Vector.add(this.offset, this.vect);
    line(this.offset.x, this.offset.y, x, y);

    if (this.next) this.next.show();
    else this.drawGraph();
  }
}
