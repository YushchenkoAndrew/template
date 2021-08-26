import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultRes, Stat } from "../ping";
import redis from "../../../config/redis";

type QueryParams = { date: string };

export type Analytics = { ctr: number; cr_media: number; cr_projects: number };
export type Data = {
  stat: Stat;
  doughnut: Analytics;
  line: number[];
  days: string[];
};

type ApiReq = {
  items: number;
  result: (InfoSum | InfoData)[];
  status: Stat;
  totalItems: number;
};

type InfoData = {
  ID: number;
  CreatedAt: string;
  Countries: string;
  Views: number;
  Clicks: number;
  Media: number;
  Visitors: number;
};

type InfoSum = {
  Views: number;
  Clicks: number;
  Media: number;
  Visitors: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | DefaultRes>
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

  const host = process.env.API_HOST ?? "";
  const port = process.env.API_PORT ?? "";
  if (host == "") {
    return res.status(500).json({
      stat: "ERR",
      message: "API HOST name is not specified",
    });
  }

  Promise.all([
    new Promise((resolve, reject) => {
      redis.hgetall("Info:Sum", (err, reply) => {
        if (!err && reply) {
          return resolve({
            ctr: +reply.Views ? +reply.Clicks / +reply.Views : 1,
            cr_media: +reply.Visitors ? +reply.Media / +reply.Visitors : 1,
            cr_projects: +reply.Visitors ? +reply.Clicks / +reply.Visitors : 1,
          });
        }

        // FIXME:
        // fetch(`${host}${port == "" ? ":" + port : ""}/api/info/sum`)
        fetch("http://localhost:31337/api/info/sum")
          .then((res) => res.json())
          .then((res: ApiReq) => {
            const result = res.result.pop();
            if (!res.items || !result)
              return reject("Idk some thing wrong with back-end");

            redis.hmset("Info:Sum", {
              Clicks: result.Clicks.toString(),
              Media: result.Media.toString(),
              Views: result.Views.toString(),
              Visitors: result.Visitors.toString(),
            });

            return resolve({
              ctr: result.Views ? result.Clicks / result.Views : 1,
              cr_media: result.Visitors ? result.Media / result.Visitors : 1,
              cr_projects: result.Visitors ? result.Media / result.Visitors : 1,
            });
          })
          .catch((err) => reject(err));
      });
    }),
    new Promise((resolve, reject) => {
      redis.get("Info:Days", (err, reply) => {
        if (!err && reply) return resolve(JSON.parse(reply));

        // FIXME: Change url to get data from range days
        // fetch(`${host}${port == "" ? ":" + port : ""}/api/info`)
        fetch("http://localhost:31337/api/info")
          .then((res) => res.json())
          .then((res: ApiReq) => {
            console.log(res);
            if (!res.items) return reject("Idk some thing wrong with back-end");

            let result = (res.result as InfoData[]).map((item) => ({
              time: item.CreatedAt.split("T")[0],
              value: item.Visitors,
            }));

            // TODO: Add updated visitors for curr date
            // result.push([ ])

            redis.set("Info:Days", JSON.stringify(result));
            return resolve(result);
          })
          .catch((err) => reject(err));
      });
    }),
  ])
    .then((results) => {
      console.log(results);

      res.status(200).json({
        stat: "OK",
        doughnut: results[0] as Analytics,
        line: [12, 19, 3, 5, 2, 3, 5],
        days: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Orange"],
      });
    })
    .catch((err) => console.log(err));

  // TODO: Get data from API
  console.log(date);
  // res.status(200).json({
  //   stat: "OK",
  //   doughnut: { ctr: 10, cr_media: 3, cr_projects: 5 },
  //   line: [12, 19, 3, 5, 2, 3, 5],
  //   days: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Orange"],
  // });
}
