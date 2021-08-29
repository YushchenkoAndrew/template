import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { ApiReq, InfoData, WorldData } from "../../../types/api";
import { Country, DayStat, StatInfo } from "../../../types/info";
import { DefaultRes, StatisticData } from "../../../types/request";
import { formatDate } from "../../info";

const apiURL =
  process.env.NODE_ENV == "production"
    ? `${process.env.API_HOST}:${process.env.API_PORT}`
    : "localhost:31337";

type QueryParams = { date: string };
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatisticData | DefaultRes>
) {
  if (req.method !== "GET") {
    return res
      .status(404)
      .json({ stat: "ERR", message: "Request handler not found" });
  }

  let { date } = req.query as QueryParams;
  if (!date) {
    return res
      .status(400)
      .json({ stat: "ERR", message: "Not all Query params are declared!" });
  }

  let prev = new Date(date);
  prev.setDate(prev.getDate() - 7);

  const now = formatDate(new Date());
  Promise.all([
    new Promise((resolve, reject) => {
      redis.hgetall("Info:Now", (err, reply) => {
        if (!err && reply && date == now) {
          return resolve({
            Visitors: +reply.Visitors,
            Views: +reply.Views,
          });
        }

        fetch(`http://${apiURL}/api/info?created_at=${date}`)
          .then((res) => res.json())
          .then((res: ApiReq) => {
            if (res.status == "ERR") {
              return reject("Idk something wrong happened at the backend");
            }
            const result = res.result.pop() as InfoData | undefined;

            // Check if the date if current one, if so load the data
            if (date == now) {
              redis.hmset("Info:Now", {
                Visitors: result?.Visitors ?? 0,
                Views: result?.Views ?? 0,
                Clicks: result?.Clicks ?? 0,
                Media: result?.Media ?? 0,
              });

              // Save countries that visited today
              if (result) {
                result.Countries.split(",").map((item) =>
                  redis.lpush("Info:Countries", item)
                );
              }
            }

            return resolve({
              Visitors: result?.Visitors ?? 0,
              Views: result?.Views ?? 0,
            });
          })
          .catch((err) => reject(err));
      });
    }),
    new Promise((resolve, reject) => {
      redis.hgetall("Info:Prev", (err, reply) => {
        if (!err && reply && date == now) {
          return resolve({
            Visitors: +reply.Visitors,
            Views: +reply.Views,
          });
        }

        fetch(`http://${apiURL}/api/info?created_at=${formatDate(prev)}`)
          .then((res) => res.json())
          .then((res: ApiReq) => {
            if (res.status == "ERR") {
              return reject("Idk something wrong happened at the backend");
            }
            const result = res.result.pop() as InfoData | undefined;

            if (date == now) {
              redis.hmset("Info:Prev", {
                Visitors: result?.Visitors ?? 0,
                Views: result?.Views ?? 0,
              });
            }

            return resolve({
              Visitors: result?.Visitors ?? 0,
              Views: result?.Views ?? 0,
            });
          })
          .catch((err) => reject(err));
      });
    }),
    new Promise((resolve, reject) => {
      redis.get("Info:Country", (err, reply) => {
        if (!err && reply) return resolve(JSON.parse(reply));

        fetch(`http://${apiURL}/api/world?page=-1`)
          .then((res) => res.json())
          .then((res: ApiReq) => {
            if (!res.items || res.status == "ERR")
              return reject("Idk something wrong happened at then backend");

            // Need this just to decrease space usage in RAM
            let result = {} as { [country: string]: number };
            (res.result as WorldData[]).forEach(
              (item) => (result[item.Country] = item.Visitors)
            );

            redis.set("Info:World", JSON.stringify(result));
            redis.expire("Info:World", 2 * 60 * 60);
            return resolve(result);
          })
          .catch((err) => reject(err));
      });
    }),
  ])
    .then((results) => {
      const now = results[0] as DayStat;
      const prev = results[1] as DayStat;
      const map = Object.entries(
        results[2] as { [country: string]: number }
      ).reduce((acc, [key, value]) => {
        acc.push({ country: key, value } as Country);
        return acc;
      }, [] as Country[]);

      return res.status(200).json({
        stat: "OK",
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
    })
    .catch((err) =>
      res.status(200).json({
        stat: "ERR",
        message: err,
      })
    );
}
