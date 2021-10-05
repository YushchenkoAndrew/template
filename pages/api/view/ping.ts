import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import md5 from "../../../lib/md5";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "HEAD") return res.status(405).send("");
  const id = req.headers["x-custom-header"];
  if (!id) return res.status(400).send("");

  redis.get(id.toString(), (err, ok) => {
    if (err || !ok) return res.status(404).send("");
    return res.status(204).send("");
  });
}
