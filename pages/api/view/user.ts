import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";

type User = { id: string; country: string; expire: number };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(404);

  let { id, country, expire } = req.body as User;
  if (!id || !country || !expire) return res.status(400);
  res.status(204);

  // TODO: Save countries
  console.log("user ");
  console.log(req.body as User);

  redis.set(id, country);
  redis.expire(id, expire);
  redis.hincrby("Info:Sum", "Visitors", 1);
}
