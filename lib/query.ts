export function createQuery(obj: any) {
  const result = Object.entries(obj)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return result === "" ? "" : "?" + result;
}
