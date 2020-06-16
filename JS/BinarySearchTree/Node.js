function Node(value) {
  this.value = value;
  this.left;
  this.right;

  this.addNode = function (value) {
    if (this.value > value) {
      this.left = createNode(this.left, value);
    } else {
      this.right = createNode(this.right, value);
    }

    function createNode(node, value) {
      if (node === undefined) node = new Node(value);
      else node.addNode(value);
      return node;
    }
  };

  this.visit = function () {
    visitNode(this.left);
    print(this.value);
    visitNode(this.right);

    function visitNode(node) {
      if (node !== undefined) node.visit(node);
    }
  };

  this.search = function (value) {
    if (value == this.value) {
      print(`Found ${value}`);
      return value;
    } else {
      if (this.left !== undefined && this.value > value) {
        return this.left.search(value);
      } else if (this.right !== undefined) {
        return this.right.search(value);
      }
    }
  };
}
