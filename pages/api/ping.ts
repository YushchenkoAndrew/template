import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../config/redis";
import { DefaultRes } from "../../types/request";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  res.status(200).json({ stat: "OK", message: "pong" });
}
