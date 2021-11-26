import { Analytics, Country, StatInfo } from "./info";

export type Stat = "OK" | "ERR";

export type DefaultRes<Type = any> = {
  status: Stat;
  message: string;
  result?: Type;
};

export type FullResponse<Type = any> = {
  status: number;
  send: DefaultRes<Type>;
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
