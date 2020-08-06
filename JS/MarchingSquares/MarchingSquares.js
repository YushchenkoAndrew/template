// Source:  https://en.wikipedia.org/wiki/Marching_squares#Basic_algorithm

class MarchingSquares {
  constructor() {
    this.field = [];
    this.zoff = 0.02;

    for (let i = 0; i < H / step + 1; i++) {
      this.field.push([]);

      for (let j = 0; j < W / step + 1; j++) this.field[i][j] = Math.round(noise(i / 20, j / 20, 0));
    }
  }

  show() {
    for (let i = 0; i < this.field.length - 1; i++)
      for (let j = 0; j < this.field[i].length - 1; j++) {
        stroke(122);
        fill(255 * this.field[i][j]);
        ellipse(j * step, i * step, step / 2);

        let index = this.field[i + 1][j] ? 0 : 1;
        index |= !this.field[i + 1][j + 1] << 1;
        index |= !this.field[i][j + 1] << 2;
        index |= !this.field[i][j] << 3;

        stroke(255);
        switch (index) {
          case 14:
          case 1: {
            line(j * step, (i + 0.5) * step, (j + 0.5) * step, (i + 1) * step);
            break;
          }

          case 13:
          case 2: {
            line((j + 0.5) * step, (i + 1) * step, (j + 1) * step, (i + 0.5) * step);
            break;
          }

          case 12:
          case 3: {
            line(j * step, (i + 0.5) * step, (j + 1) * step, (i + 0.5) * step);
            break;
          }

          case 11:
          case 4: {
            line((j + 0.5) * step, i * step, (j + 1) * step, (i + 0.5) * step);
            break;
          }

          case 5: {
            line((j + 0.5) * step, (i + 1) * step, (j + 1) * step, (i + 0.5) * step);
            line(j * step, (i + 0.5) * step, (j + 0.5) * step, i * step);
            break;
          }

          case 9:
          case 6: {
            line((j + 0.5) * step, i * step, (j + 0.5) * step, (i + 1) * step);
            break;
          }

          case 8:
          case 7: {
            line(j * step, (i + 0.5) * step, (j + 0.5) * step, i * step);
            break;
          }

          case 10: {
            line((j + 0.5) * step, i * step, (j + 1) * step, (i + 0.5) * step);
            line(j * step, (i + 0.5) * step, (j + 0.5) * step, (i + 1) * step);
            break;
          }
        }
      }

    for (let i in this.field) for (let j in this.field[i]) this.field[i][j] = Math.round(noise(i / 25, j / 25, this.zoff));

    this.zoff += 0.02;
  }
}
