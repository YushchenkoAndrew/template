import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { sendLogs } from "../../../lib/api/bot";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).send("");
  if (!req.query["id"]) return res.status(400).send("");
  res.status(204).send("");

  // Run in background
  setTimeout(() => {
    const id = req.query["id"] as string;
    redis.get(`USER:${id}`, (err, reply) => {
      console.log("[HANDLER] Click event USER:" + id);
      if (err) {
        return sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/view/click.ts",
          message: "Ohhh noooo, Cache is broken!!!",
          desc: err,
        });
      }

      if (reply) return redis.hincrby("Info:Now", "Clicks", 1);
    });
  }, 0);
}
