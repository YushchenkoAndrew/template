import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { formatDate } from "../../info";
import { ApiReq, InfoData } from "../../../types/api";
import { AnalyticsData, DefaultRes, Stat } from "../../../types/request";
import { Analytics } from "../../../types/info";

const apiURL =
  process.env.NODE_ENV == "production"
    ? `${process.env.API_HOST}:${process.env.API_PORT}`
    : "localhost:31337";

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
      .status(404)
      .json({ stat: "ERR", message: "Request handler not found" });
  }

  let { date } = req.query as QueryParams;
  if (!date) {
    return res
      .status(400)
      .json({ stat: "ERR", message: "Not all Query params are declared!" });
  }

  const now = formatDate(new Date());

  redis.get("Info:Day", (err, prevDate) => {
    Promise.all([
      new Promise((resolve, reject) => {
        redis.hgetall("Info:Sum", (err, reply) => {
          if (!err && reply) {
            return resolve({
              ctr: +reply.Views ? +reply.Clicks / +reply.Views : 1,
              cr_media: +reply.Visitors ? +reply.Media / +reply.Visitors : 1,
              cr_projects: +reply.Visitors
                ? +reply.Clicks / +reply.Visitors
                : 1,
            });
          }

          fetch(`http://${apiURL}/api/info/sum`)
            .then((res) => res.json())
            .then((res: ApiReq) => {
              const result = res.result.pop() as InfoData;
              if (!res.items || !result || res.status == "ERR")
                return reject("Idk some thing wrong with back-end");

              redis.hmset("Info:Sum", {
                Clicks: result.Clicks.toString(),
                Media: result.Media.toString(),
                Views: result.Views.toString(),
                Visitors: result.Visitors.toString(),
              });

              // TODO: Cron job to send update to back

              return resolve({
                ctr: result.Views ? result.Clicks / result.Views : 1,
                cr_media: result.Visitors ? result.Media / result.Visitors : 1,
                cr_projects: result.Visitors
                  ? result.Media / result.Visitors
                  : 1,
              });
            })
            .catch((err) => reject(err));
        });
      }),
      new Promise((resolve, reject) => {
        redis.get("Info:Days", (err, reply) => {
          redis.set("Info:Day", date);
          if (!err && reply && prevDate == date)
            return resolve(JSON.parse(reply));

          let prev = new Date(date);
          prev.setDate(prev.getDate() - 7);

          fetch(
            `http://${apiURL}/api/info/range?end=${date}&start=${formatDate(
              prev
            )}&orderBy=CreatedAt`
          )
            .then((res) => res.json())
            .then((res: ApiReq) => {
              if (!res.items || res.status == "ERR")
                return reject("Idk some thing wrong with back-end");

              let result = (res.result as InfoData[]).map((item) => ({
                time: item.CreatedAt.split("T")[0],
                value: item.Visitors,
              }));

              redis.set("Info:Days", JSON.stringify(result));
              redis.expire("Info:Days", 2 * 60 * 60);
              return resolve(result);
            })
            .catch((err) => reject(err));
        });
      }),
    ])
      .then((results) => {
        if (now != date) {
          return res
            .status(200)
            .json(FormData(results[0] as Analytics, results[1] as TimeLine[]));
        }

        redis.hgetall("Info:Sum", (err, reply) => {
          if (!err && reply) {
            (results[1] as TimeLine[]).pop();
            (results[1] as TimeLine[]).push({
              time: now,
              value: +reply.Visitors,
            });
          }

          res
            .status(200)
            .json(FormData(results[0] as Analytics, results[1] as TimeLine[]));
        });
      })
      .catch((err) => console.log(err));
  });
}
