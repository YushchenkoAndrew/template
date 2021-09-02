import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";

type User = { id: string; country: string; expired: number };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(404).send("");

  let { id, country, expired } = req.body as User;
  if (!id || !country || !expired || isNaN(+expired))
    return res.status(400).send("");
  res.status(204).send("");

  // Run in background
  setTimeout(() => {
    // TODO: Save countries
    console.log("user ");
    console.log(req.body as User);

    redis.set(id, country);
    redis.expire(id, expired);

    redis.hincrby("Info:Now", "Visitors", 1);
    redis.hincrby("Info:Now", "Views", 1);
    redis.lpush("Info:Countries", country);
  }, 0);
}
