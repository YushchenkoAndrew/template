import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { ApiReq, WorldData } from "../../../types/api";
import { Country, StatInfo } from "../../../types/info";
import { DefaultRes, StatisticData } from "../../../types/request";

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

  Promise.all([
    new Promise((resolve, reject) => {
      redis.hgetall("Info:Stat", (err, reply) => {
        if (!err && reply) {
          return resolve({
            users: { value: +reply.userValue, gain: +reply.userGain },
            views: { value: +reply.viewsValue, gain: +reply.viewsGain },
            countries: +reply.countries,
          });
        }

        fetch(`http://${apiURL}/api/info/sum`)
          .then((res) => res.json())
          .then((res: ApiReq) => {
            const result = res.result.pop();
            if (!res.items || !result || res.status == "ERR")
              return reject("Idk some thing wrong with back-end");

            // TODO:
            // redis.hmset("Info:Sum", {
            //   Clicks: result.Clicks.toString(),
            //   Media: result.Media.toString(),
            //   Views: result.Views.toString(),
            //   Visitors: result.Visitors.toString(),
            // });

            // TODO: Cron job to send update to back

            // FIXME:
            return resolve({
              users: { value: 25, gain: -64 },
              views: { value: 155, gain: 64 },
              countries: 55,
            });
          })
          .catch((err) => reject(err));
      });
    }),
    new Promise((resolve, reject) => {
      redis.get("Info:Country", (err, reply) => {
        if (!err && reply) return resolve(JSON.parse(reply));

        let prev = new Date(date);
        prev.setDate(prev.getDate() - 7);

        fetch(`http://${apiURL}/api/world`)
          .then((res) => res.json())
          .then((res: ApiReq) => {
            console.log(res);
            if (!res.items || res.status == "ERR")
              return reject("Idk some thing wrong with back-end");

            let result = (res.result as WorldData[]).map((item) => ({
              country: item.Country,
              value: item.Visitors,
            }));

            // redis.set("Info:Days", JSON.stringify(result));
            // redis.expire("Info:Days", 2 * 60 * 60);
            return resolve(result);
          })
          .catch((err) => reject(err));
      });
    }),
  ])
    .then((results) => {
      res.status(200).json({
        stat: "OK",
        info: results[0] as StatInfo,
        map: results[1] as Country[],
      });
    })
    .catch((err) => console.log(err));

  // TODO: Get data from API
  console.log(date);

  // res.status(200).json({
  //   stat: "OK",
  //   info: {
  //     users: { value: 25, gain: -64 },
  //     views: { value: 155, gain: 64 },
  //     countries: 55,
  //   },
  //   map: [
  //     { country: "cn", value: 1389618778 },
  //     { country: "in", value: 1311559204 },
  //     { country: "us", value: 331883986 },
  //     { country: "id", value: 264935824 },
  //     { country: "pk", value: 210797836 },
  //     { country: "br", value: 210301591 },
  //     { country: "ng", value: 208679114 },
  //     { country: "bd", value: 161062905 },
  //     { country: "RU", value: 141944641 },
  //     { country: "mx", value: 127318112 },
  //   ],
  // });
}
