import { Stat } from "./request";

export type LogMessage = {
  stat?: Stat;
  name: "API" | "WEB";
  url?: string;
  file?: string;
  message: string;
  desc?: any;
};
