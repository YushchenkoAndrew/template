import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { DefaultRes } from "../../../types/request";

type QueryParams = { id: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST")
    return res.status(404).json({
      stat: "ERR",
      message: "Method not supported",
    });

  // TODO: Add JWT or HASH authentication

  redis.hmset("Info:Now", {
    Visitors: 0,
    Views: 0,
    Clicks: 0,
    Media: 0,
  });

  res.status(200).json({
    stat: "OK",
    message: "Data is reset",
  });
}
