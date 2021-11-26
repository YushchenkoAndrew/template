import { FileData, ProjectData } from "../../types/api";

export function formPath({ role, path, name }: FileData) {
  return `/${role}/${path}${name}`;
}

export function getPath(path: string | undefined) {
  if (!path) return "";
  return "&path=" + (path[0] !== "/" ? "/" + path : path);
}
