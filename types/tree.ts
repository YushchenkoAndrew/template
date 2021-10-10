import { ProjectFile } from "./projects";

export type TreeObj = {
  [name: string]: TreeObj | ProjectFile | null;
};
