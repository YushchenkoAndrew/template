import { FileData } from "./api";

export type TreeObj = {
  [name: string]: TreeObj | FileData | null;
};
