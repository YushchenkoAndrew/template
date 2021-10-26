import { FileData, ProjectData } from "../types/api";
import { ProjectFile, ProjectForm } from "../types/projects";

export function formPath({ Role, Path, Name }: FileData) {
  return `/${Role}/${Path}${Name}`;
}

export function getDir(dir: string | undefined) {
  if (!dir) return "";
  return "&dir=" + (dir[0] !== "/" ? "/" + dir : dir);
}

export function convertProject(data: ProjectData): ProjectForm {
  return {
    name: data.Name,
    title: data.Title,
    flag: data.Flag,
    desc: data.Desc,
    note: data.Note,
  } as ProjectForm;
}

export function convertFile(data: FileData): ProjectFile {
  return {
    name: data.Name,
    dir: data.Path,
    type: data.Type,
    role: data.Role,
  } as ProjectFile;
}
