import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { formatDate } from "../../info";
import { ApiRes, InfoData } from "../../../types/api";
import { AnalyticsData, DefaultRes, Stat } from "../../../types/request";
import { apiHost, botHost } from "../../../config";
import { Analytics } from "../../../types/info";
import { LogMessage } from "../../../types/bot";
import { sendLogs } from "../../../lib/bot";

type QueryParams = { date: string };

type TimeLine = { time: string; value: number };

function FormData(doughnut: Analytics, lineData: TimeLine[]): AnalyticsData {
  return {
    stat: "OK",
    doughnut,
    line: lineData.map((item) => item.value),
    days: lineData.map((item) => item.time),
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsData | DefaultRes>
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

  const now = formatDate(new Date());
  Promise.all([
    new Promise((resolve, reject) => {
      redis.get("Info:Stat", (err, reply) => {
        if (!err && reply) return resolve(JSON.parse(reply));

        fetch(`http://${apiHost}/api/info/sum`)
          .then((res) => res.json())
          .then((res: ApiRes) => {
            if (res.status == "ERR")
              return reject("Idk something wrong happened at the backend");

            const result = res.result.pop() as InfoData;
            if (!res.items || !result)
              return reject("Idk something wrong happened at the backend");

            const stat = {
              ctr: result.Views ? result.Clicks / result.Views : 1,
              cr_media: result.Visitors ? result.Media / result.Visitors : 1,
              cr_projects: result.Visitors
                ? result.Clicks / result.Visitors
                : 1,
            };

            redis.set("Info:Stat", JSON.stringify(stat));
            redis.expire("Info:Stat", 2 * 60 * 60);
            return resolve(stat);
          })
          .catch((err) => reject(err));
      });
    }),
    new Promise((resolve, reject) => {
      redis.get("Info:Days", (err, reply) => {
        if (!err && reply && now == date) return resolve(JSON.parse(reply));

        let prev = new Date(date);
        prev.setDate(prev.getDate() - 7);

        fetch(
          `http://${apiHost}/api/info/range?end=${date}&start=${formatDate(
            prev
          )}&orderBy=CreatedAt`
        )
          .then((res) => res.json())
          .then((res: ApiRes) => {
            if (!res.items || res.status == "ERR")
              return reject("Idk something wrong happened at the backend");

            // Need this just to decrease space usage in RAM
            let result = {} as { [time: string]: number };
            (res.result as InfoData[]).forEach(
              (item) => (result[item.CreatedAt.split("T")[0]] = item.Visitors)
            );

            redis.set("Info:Days", JSON.stringify(result));
            if (
              new Date(prev) > new Date(now) ||
              new Date(date) < new Date(now)
            ) {
              return resolve(result);
            }

            // Add now values from another place in Cache
            redis.hget("Info:Now", "Visitors", (err, reply) => {
              if (!err && reply) result[now] = +reply;
              resolve(result);
            });
          })
          .catch((err) => reject(err));
      });
    }),
  ])
    .then((results) => {
      let timeline = Object.entries(
        results[1] as { [time: string]: number }
      ).reduce((acc, [key, value]) => {
        acc.push({ time: key, value } as TimeLine);
        return acc;
      }, [] as TimeLine[]);

      res.status(200).json(FormData(results[0] as Analytics, timeline));
    })
    .catch((err) => {
      res.status(200).json({
        status: "ERR",
        message: err,
      });

      sendLogs({
        stat: "ERR",
        name: "WEB",
        file: "/api/info/analytics.ts",
        message: "Couldn't reach analytics data",
        desc: err,
      });
    });
}
