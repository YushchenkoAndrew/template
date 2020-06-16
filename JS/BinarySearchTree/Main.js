let tree;

function setup() {
  createCanvas(700, 700, WEBGL);
  background(0);

  tree = new Tree();

  for (let i = 1; i < 10; i++) {
    tree.addValue(Math.floor(random(100)));
  }

  tree.toString();
  print(tree);
}

function draw() {}
