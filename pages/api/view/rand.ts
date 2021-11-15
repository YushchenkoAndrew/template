import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import md5 from "../../../lib/md5";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "HEAD") return res.status(405).send("");

  const date = new Date();
  const now = date.getTime() - date.getTimezoneOffset() * 60000;
  const hash = md5(now.toString());

  redis.set(`RAND:${hash}`, "OK");
  redis.expire(`RAND:${hash}`, 5);

  res.setHeader("X-Custom-Header", now).status(204).send("");
}
