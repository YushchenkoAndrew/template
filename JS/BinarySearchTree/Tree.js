function Tree() {
  this.head;

  this.addValue = function (value) {
    if (this.head === undefined) {
      this.head = new Node(value);
    } else {
      this.head.addNode(value);
    }
  };

  this.toString = function () {
    this.head.visit();
  };

  this.search = function (value) {
    return this.head.search(value);
  };
}
