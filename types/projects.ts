import Projects from "../pages/projects";
import { FileData } from "./api";

export type ProjectFields = "name" | "title" | "desc" | "img";

// export type ProjectFile = {
//   name: string;
//   path?: string;
//   url?: string;
//   type: string;
//   role: string;
// };

export type ProjectElement = {
  target: {
    name: string;
    value: FileData[];
    // value: FileData | FileData[];
  };
};

// export type ProjectForm = {
//   name: string;
//   flag: string;
//   title: string;
//   desc: string;
//   note: string;
//   link: string;
//   img: ProjectFile;
// };

// export type ProjectLink = {
//   name: string;
//   link: string;
// };
