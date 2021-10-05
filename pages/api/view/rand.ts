import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import md5 from "../../../lib/md5";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "HEAD") return res.status(405).send("");

  const now = new Date().getTime().toString();
  const hash = md5(now);

  redis.set(`RAND:${hash}`, "OK");
  redis.expire(`RAND:${hash}`, 2);

  console.log();
  res.setHeader("X-Custom-Header", now).status(204).send("");
}
