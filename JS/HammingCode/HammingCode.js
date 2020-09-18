class HammingCode {
  constructor(size = 4) {
    this.size = size;

    this.data = [];
    // this.createRand();

    // Testing data
    this.data = [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0];
  }

  createRand() {
    for (let i = 0; i < this.size * this.size; i++) this.data.push(Math.round(Math.random()));
  }

  checkData() {
    console.table(this.data);

    // console.log(this.data.reduce((acc, curr) => acc ^ curr));

    let acc = 0;
    for (let i in this.data) if (this.data[i]) acc ^= i;

    console.log(acc);
  }
}
