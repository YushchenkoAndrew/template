import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultRes } from "../ping";

type User = { id: string; country: string; url: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res
      .status(404)
      .json({ stat: "ERR", message: "Request handler not found" });
  }

  console.log("user ");
  console.log(req.body as User);

  res.status(200).json({
    stat: "OK",
    message: "Success",
  });
}
