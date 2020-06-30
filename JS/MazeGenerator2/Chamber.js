class Chamber {
  constructor(x, y, w, h, wall = {}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.walls = {};

    switch (wall.type) {
      case "NW": {
        this.walls.Down = [
          this.x,
          this.y + this.h,
          this.x + this.w,
          this.y + this.h,
        ];
        this.walls.Right = [
          this.x + this.w,
          this.y,
          this.x + this.w,
          this.y + this.h,
        ];

        this.walls.Down = setHole(this.walls.Down, wall.Down, 0);
        this.walls.Right = setHole(this.walls.Right, wall.Right, 1);
        break;
      }
      case "NE": {
        this.walls.Down = [
          this.x,
          this.y + this.h,
          this.x + this.w,
          this.y + this.h,
        ];
        this.walls.Left = [this.x, this.y, this.x, this.y + this.h];

        this.walls.Down = setHole(this.walls.Down, wall.Down, 0);
        this.walls.Left = setHole(this.walls.Left, wall.Left, 1);
        break;
      }
      case "SW": {
        this.walls.Up = [this.x, this.y, this.x + this.w, this.y];
        this.walls.Right = [
          this.x + this.w,
          this.y,
          this.x + this.w,
          this.y + this.h,
        ];

        this.walls.Up = setHole(this.walls.Up, wall.Up, 0);
        this.walls.Right = setHole(this.walls.Right, wall.Right, 1);
        break;
      }
      case "SE": {
        this.walls.Up = [this.x, this.y, this.x + this.w, this.y];
        this.walls.Left = [this.x, this.y, this.x, this.y + this.h];

        this.walls.Up = setHole(this.walls.Up, wall.Up, 0);
        this.walls.Left = setHole(this.walls.Left, wall.Left, 1);
        break;
      }
      default: {
        this.walls.Up = [[this.x, this.y, this.x + this.w, this.y]];
        this.walls.Left = [[this.x, this.y, this.x, this.y + this.h]];
        this.walls.Right = [
          [this.x + this.w, this.y, this.x + this.w, this.y + this.h],
        ];
        this.walls.Down = [
          [this.x, this.y + this.h, this.x + this.w, this.y + this.h],
        ];
      }
    }

    function setHole(line, hole, index) {
      if (hole === undefined) return [line];

      let lines = [line, line.slice()];

      lines[0][index + 2] = hole;
      lines[1][index] = hole + step;
      return lines;
    }
  }

  show() {
    stroke(255);
    // noFill();

    // rect(this.x, this.y, this.w, this.h);
    for (let i in this.walls)
      for (let j in this.walls[i]) line(...this.walls[i][j]);
  }
}
