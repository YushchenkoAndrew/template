import { FileData } from "../types/api";

export function formPath({ Role, Path, Name }: FileData) {
  return `/${Role}/${Path}${Name}`;
}
