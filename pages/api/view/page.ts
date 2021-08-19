import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultRes } from "../ping";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "PATCH") {
    return res
      .status(404)
      .json({ stat: "ERR", message: "Request handler not found" });
  }

  // TODO: Send to API
  console.log("page view++");
  res.status(200).json({
    stat: "OK",
    message: "Success",
  });
}
