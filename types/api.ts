import { Stat } from "./request";

export type ApiError = {
  status: Stat;
  result: string[];
  message: string;
};

export type ApiTokens = {
  status: Stat;
  access_token: string;
  refresh_token: string;
};

export type ApiResult = InfoSum | InfoData | WorldData | ProjectData | FileData;

export type ApiRes<Type> = {
  items: number;
  result: Type[];
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

export type FileData = {
  ID: number;
  UpdatedAt: string;
  Name: string;
  Path: string;
  Type: string;
  Role: string;
  ProjectID: number;
};

export type LinkData = {
  ID: number;
  UpdatedAt: string;
  Name: string;
  Link: string;
  ProjectID: number;
};

export type ProjectData = {
  ID: number;
  CreatedAt: string;
  Name: string;
  Title: string;
  Flag: string;
  Desc: string;
  Note: string;
  Files: FileData[];
  Links: LinkData[];
};

export type GeoIpLocationData = {
  GeonameId: number;
  LocaleCode: string;
  ContinentCode: string;
  ContinentName: string;
  CountryIsoCode: string;
  CountryName: string;
  IsInEuropeanUnion: boolean;
};
