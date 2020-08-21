function name(...data) {
  console.log(data);

  $.terminal.active().echo(`func - name   --  ${data}`);
}

function sum(a, b) {
  // let a = Number(a_);
  // let b = Number(b_);

  console.log(a + b);
  $.terminal.active().echo(`${outputSign} sum = ${a} + ${b} = ${a + b}`);
}
