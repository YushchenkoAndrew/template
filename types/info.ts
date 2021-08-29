export type Analytics = { ctr: number; cr_media: number; cr_projects: number };
export type Country = { country: string; value: number };

type Stat = { value: number; gain: number };
export type StatInfo = { users: Stat; views: Stat; countries: number };

export type DayStat = { Visitors: number; Views: number };
