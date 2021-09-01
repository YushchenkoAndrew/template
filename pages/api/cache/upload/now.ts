import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../../config/redis";
import md5 from "../../../../lib/md5";
import { DefaultRes } from "../../../../types/request";

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

  console.log(md5(process.env.API_PEPPER + "54" + process.env.API_PASS));
  res.status(200).json({
    stat: "OK",
    message: "",
  });
}
