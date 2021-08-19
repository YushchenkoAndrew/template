import type { NextApiRequest, NextApiResponse } from "next";

export type Stat = "OK" | "ERR";
export type DefaultRes = {
  stat: Stat;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  res.status(200).json({ stat: "OK", message: "pong" });
}
