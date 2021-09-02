import { Stat } from "./request";

export type ApiError = {
  stat: Stat;
  result: string[];
  message: string;
};

export type ApiTokens = {
  stat: Stat;
  access_token: string;
  refresh_token: string;
};

export type ApiReq = {
  items: number;
  result: (InfoSum | InfoData | WorldData)[];
  status: Stat;
  totalItems: number;
};

export type InfoData = {
  ID: number;
  CreatedAt: string;
  Countries: string;
  Views: number;
  Clicks: number;
  Media: number;
  Visitors: number;
};

export type InfoSum = {
  Views: number;
  Clicks: number;
  Media: number;
  Visitors: number;
};

export type WorldData = {
  ID: number;
  UpdatedAt: string;
  Country: string;
  Visitors: number;
};
