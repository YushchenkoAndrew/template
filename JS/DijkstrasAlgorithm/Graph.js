class Graph {
  constructor(graph, x, y) {
    this.graph = graph;

    this.x = x;
    this.y = y;
    this.r = 25;

    this.pos = [];

    for (let i in this.graph)
      this.pos.push({
        x: this.x + step * i,
        y: this.y + random(-5, 5) * step,
        color: color(255),
      });
  }

  // Source: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Algorithm
  dijkstra(start) {
    let nodes = [];

    for (let i in this.graph)
      nodes.push({ dist: Infinity, visited: false, path: [] });

    nodes[start].dist = 0;

    for (let i in nodes) {
      let u = minDist(nodes);

      nodes[u].visited = true;

      for (let v in this.graph) {
        if (
          nodes[u].dist + this.graph[u][v] < nodes[v].dist &&
          !nodes[v].visited &&
          this.graph[u][v]
        ) {
          nodes[v].dist = nodes[u].dist + this.graph[u][v];
          nodes[v].path.push(int(u));
          // console.log(`u = ${u}, v = ${v}, nodes[v].dist = ${nodes[v].dist}`);
        }
      }

      // console.log(nodes);
    }

    console.log(nodes);

    return nodes;

    function minDist(nodes) {
      let min = Infinity;
      let index = -1;

      for (let i in nodes) {
        if (min > nodes[i].dist && !nodes[i].visited) {
          min = nodes[i].dist;
          index = i;
        }
      }

      return index;
    }
  }
  rebuildPath(nodes, index) {
    if (nodes[index].path.length == 0) return [index];

    let path = [...this.rebuildPath(nodes, nodes[index].path[0])];
    path.push(index);

    return path;
  }

  findPath(start, end) {
    let path = [...this.rebuildPath(this.dijkstra(start), end)];

    console.log(path);

    for (let i of path) {
      this.pos[i].color = color(255, 0, 0);
    }

    console.log(this.pos);
  }

  show() {
    strokeWeight(2);

    for (let i in this.graph) {
      for (let j in this.graph) {
        if (this.graph[i][j] != 0) {
          let col =
            blue(this.pos[i].color) == blue(this.pos[j].color)
              ? this.pos[i].color
              : color(255);

          stroke(col);
          if (i == j) {
            noFill();
            ellipse(this.pos[i].x, this.pos[i].y - step / 2, step);
          } else
            line(this.pos[i].x, this.pos[i].y, this.pos[j].x, this.pos[j].y);
        }
      }
    }

    stroke(255);

    for (let i in this.pos) {
      fill(255);
      ellipse(this.pos[i].x, this.pos[i].y, this.r);
      fill(0);
      text(i, this.pos[i].x - this.r / 4, this.pos[i].y + this.r / 3);
    }
  }
}
