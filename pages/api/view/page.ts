import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { sendLogs } from "../../../lib/bot";

type QueryParams = { id: string; url: string };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).send("");
  if (!req.query["id"] || !req.query["url"]) return res.status(400).send("");
  res.status(204).send("");

  // Run in background
  setTimeout(() => {
    let { id, url } = req.query as QueryParams;
    redis.get(id, (err, reply) => {
      if (!err && reply) {
        // console.log(`id=${id} url=${url} country=${reply} page++`);
        return redis.hincrby("Info:Now", "Views", 1);
      }

      sendLogs({
        stat: "ERR",
        name: "WEB",
        file: "/api/view/page.ts",
        message: "Ohhh noooo, Cache is broken!!!",
        desc: err,
      });
    });
  }, 0);
}
