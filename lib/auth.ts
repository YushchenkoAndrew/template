export function PassValidate(pass: string, pass2: string) {
  let equal = true;
  let max = pass.length > pass2.length ? pass.length : pass2.length;
  for (let i = 0; i < max; i++) {
    equal =
      equal &&
      i < pass2.length &&
      i < pass.length &&
      pass2.charAt(i) == pass.charAt(i);
  }
  return equal;
}
