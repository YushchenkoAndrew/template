import Projects from "../pages/projects";

export type ProjectFields = "name" | "title" | "desc" | "img";

export type ProjectFile = {
  name: string;
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
  title: string;
  desc: string;
  img: ProjectFile;
};
