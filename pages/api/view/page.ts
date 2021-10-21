import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { sendLogs } from "../../../lib/bot";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).send("");
  if (!req.query["id"]) return res.status(400).send("");
  res.status(204).send("");

  // Run in background
  setTimeout(() => {
    let id = req.query["id"] as string;
    redis.get(id, (err, reply) => {
      if (err) {
        return sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/view/page.ts",
          message: "Ohhh noooo, Cache is broken!!!",
          desc: err,
        });
      }

      if (reply) return redis.hincrby("Info:Now", "Views", 1);
    });
  }, 0);
}
