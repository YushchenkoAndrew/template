import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { ApiRes, InfoData, WorldData } from "../../../types/api";
import { Country, DayStat } from "../../../types/info";
import { DefaultRes, StatisticData } from "../../../types/request";
import { apiUrl } from "../../../config";
import { formatDate } from "../../info";
import { sendLogs } from "../../../lib/api/bot";
import { freeMutex, waitMutex } from "../../../lib/api/mutex";

type QueryParams = { date: string };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatisticData | DefaultRes>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ status: "ERR", message: "Request handler not found" });
  }

  let { date } = req.query as QueryParams;
  if (!date) {
    return res
      .status(400)
      .json({ status: "ERR", message: "Not all Query params are declared!" });
  }

  try {
    let yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 7);

    const today = formatDate(new Date());
    const results = await Promise.all([
      new Promise((resolve, reject) => {
        waitMutex().then(() => {
          redis.hgetall("Info:Now", (err, reply) => {
            freeMutex();
            if (!err && reply && date == today) {
              return resolve({
                Visitors: +reply.Visitors,
                Views: +reply.Views,
              });
            }

            fetch(`${apiUrl}/info?created_at=${date}`)
              .then((res) => res.json())
              .then((res: ApiRes<InfoData[]>) => {
                if (res.status == "ERR") {
                  return reject("Idk something wrong happened at the backend");
                }
                const result = res.result.pop();

                // Check if the date if current one, if so load the data
                if (date == today) {
                  waitMutex().then(() => {
                    redis.hmset(
                      "Info:Now",
                      {
                        Visitors: result?.visitors ?? 0,
                        Views: result?.views ?? 0,
                        Clicks: result?.clicks ?? 0,
                        Media: result?.media ?? 0,
                      },
                      () => freeMutex()
                    );
                  });

                  // Save countries that visited today
                  if (result) {
                    result.countries.split(",").map((item) => {
                      waitMutex().then(() => {
                        redis.lpush("Info:Countries", item, () => freeMutex());
                      });
                    });
                  }
                }

                return resolve({
                  Visitors: result?.visitors ?? 0,
                  Views: result?.views ?? 0,
                });
              })
              .catch((err) => reject(err));
          });
        });
      }),
      new Promise((resolve, reject) => {
        waitMutex().then(() => {
          redis.hgetall("Info:Prev", (err, reply) => {
            freeMutex();
            if (!err && reply && date == today) {
              return resolve({
                Visitors: +reply.Visitors,
                Views: +reply.Views,
              });
            }

            fetch(`${apiUrl}/info?created_at=${formatDate(yesterday)}`)
              .then((res) => res.json())
              .then((res: ApiRes<InfoData[]>) => {
                if (res.status == "ERR") {
                  return reject("Idk something wrong happened at the backend");
                }

                const result = res.result.pop();
                if (date == today) {
                  waitMutex().then(() => {
                    redis.hmset(
                      "Info:Prev",
                      {
                        Visitors: result?.visitors ?? 0,
                        Views: result?.views ?? 0,
                      },
                      () => freeMutex()
                    );
                  });
                }

                return resolve({
                  Visitors: result?.visitors ?? 0,
                  Views: result?.views ?? 0,
                });
              })
              .catch((err) => reject(err));
          });
        });
      }),
      new Promise((resolve, reject) => {
        waitMutex().then(() => {
          redis.get("Info:World", (err, reply) => {
            freeMutex();
            if (!err && reply) return resolve(JSON.parse(reply));

            // NOTE: This will run only in the case where none of users were identified
            fetch(`${apiUrl}/world?page=-1`)
              .then((res) => res.json())
              .then((res: ApiRes<WorldData[]>) => {
                if (!res.items || res.status == "ERR")
                  return reject("Idk something wrong happened at then backend");

                // Need this just to decrease space usage in RAM
                let result = {} as { [country: string]: number };
                res.result.forEach(
                  (item) => (result[item.country] = item.visitors)
                );

                waitMutex().then(() => {
                  redis.set("Info:World", JSON.stringify(result), () => {
                    freeMutex();
                  });
                });

                return resolve(result);
              })
              .catch((err) => reject(err));
          });
        });
      }),
    ]);
    // .then((results) => {
    const now = results[0] as DayStat;
    const prev = results[1] as DayStat;
    const map = Object.entries(
      results[2] as { [country: string]: number }
    ).reduce((acc, [key, value]) => {
      acc.push({ country: key, value } as Country);
      return acc;
    }, [] as Country[]);

    return res.status(200).json({
      status: "OK",
      info: {
        users: {
          value: now.Visitors,
          gain: (now.Visitors - prev.Visitors) / 100,
        },
        views: { value: now.Views, gain: (now.Views - prev.Views) / 100 },
        countries: map.length,
      },
      map,
    });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      message: err as string,
    });

    sendLogs({
      stat: "ERR",
      name: "WEB",
      file: "/api/info/statistic.ts",
      message: "Couldn't reach statistic data",
      desc: err,
    });
  }
}
