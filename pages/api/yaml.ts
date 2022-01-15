import type { NextApiRequest, NextApiResponse } from "next";
import { DefaultRes } from "../../types/request";
import YAML from "yaml";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  res.status(200).json({
    status: "OK",
    message: "Success!!",
    result: YAML.stringify(req.body ?? {}),
  });
}
