import md5 from "../md5";

export function CacheId(name: string = "") {
  return md5(
    (localStorage.getItem("salt") ?? "") +
      (localStorage.getItem("id") ?? "") +
      name
  );
}
