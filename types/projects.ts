import Projects from "../pages/projects";

export type ProjectFields = "name" | "title" | "desc" | "img";

export type ProjectFile = {
  file: File;
  name: string;
  dir?: string;
  url?: string;
  type: string;
  role: string;
};

export type ProjectElement = {
  target: {
    name: string;
    value: ProjectFile | ProjectFile[];
  };
};

export type ProjectForm = {
  name: string;
  flag: string;
  title: string;
  desc: string;
  note: string;
  link: string;
  img: ProjectFile;
};

export type ProjectLink = {
  name: string;
  link: string;
};
