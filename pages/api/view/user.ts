import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultRes } from "../ping";
import redis from "../../../config/redis";

type User = { id: string; country: string; expire: number };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res
      .status(404)
      .json({ stat: "ERR", message: "Request handler not found" });
  }

  let { id, country, expire } = req.body as User;
  if (!id || !country || !expire) {
    return res
      .status(400)
      .json({ stat: "ERR", message: "Incorrect body params" });
  }

  console.log("user ");
  console.log(req.body as User);

  redis.set(id, country);
  redis.expire(id, expire);

  res.status(200).json({
    stat: "OK",
    message: "Success",
  });
}
