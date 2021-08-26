import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultRes } from "../ping";
import redis from "../../../config/redis";

type QueryParams = { id: string; url: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "PATCH") {
    return res
      .status(404)
      .json({ stat: "ERR", message: "Request handler not found" });
  }

  if (!req.query["id"] || !req.query["url"]) {
    return res
      .status(400)
      .json({ stat: "ERR", message: "Incorrect query params" });
  }

  res.status(200).json({
    stat: "OK",
    message: "Success",
  });

  let { id, url } = req.query as QueryParams;
  redis.get(id, (err, reply) => {
    if (err || !reply) return;

    // TODO: Send to API
    console.log(`id=${id} url=${url} country=${reply} page++`);
    redis.hincrby("Info:Sum", "Views", 1);
  });
}
