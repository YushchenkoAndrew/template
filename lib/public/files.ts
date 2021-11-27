import { FileData, ProjectData } from "../../types/api";

export function formPath(file?: FileData) {
  if (!file) return "";
  return `/${file.role}/${file.path}${file.name}`;
}

export function getPath(path: string | undefined) {
  if (!path) return "";
  return "&path=" + (path[0] !== "/" ? "/" + path : path);
}
