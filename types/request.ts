import { Analytics, Country, StatInfo } from "./info";

export type Stat = "OK" | "ERR";
export type DefaultRes = {
  stat: Stat;
  message: string;
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
