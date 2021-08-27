import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";

type QueryParams = { id: string; url: string };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(404);
  if (!req.query["id"] || !req.query["url"]) return res.status(400);
  res.status(204);

  let { id, url } = req.query as QueryParams;
  redis.get(id, (err, reply) => {
    if (err || !reply) return;

    // TODO: Send to API
    console.log(`id=${id} url=${url} country=${reply} page++`);
    redis.hincrby("Info:Sum", "Views", 1);
  });
}
