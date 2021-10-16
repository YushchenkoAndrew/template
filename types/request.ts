import { Analytics, Country, StatInfo } from "./info";

export type Stat = "OK" | "ERR";
export type DefaultRes = {
  status: Stat;
  message: string;
  result?: any;
};

export type FullResponse = {
  status: number;
  send: DefaultRes;
};

export type AnalyticsData = {
  stat: Stat;
  doughnut: Analytics;
  line: number[];
  days: string[];
};

export type StatisticData = {
  stat: Stat;
  info: StatInfo;
  map: Country[];
};
