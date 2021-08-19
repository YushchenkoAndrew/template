import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultRes, Stat } from "../ping";

export type Analytics = { ctr: number; cr_media: number; cr_projects: number };
export type Data = {
  stat: Stat;
  doughnut: Analytics;
  line: number[];
  days: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | DefaultRes>
) {
  if (req.method !== "GET") {
    return res
      .status(404)
      .json({ stat: "ERR", message: "Request handler not found" });
  }

  let { date } = req.query;
  if (!date) {
    return res
      .status(400)
      .json({ stat: "ERR", message: "Date is not declared!" });
  }

  // TODO: Get data from API
  console.log(date);

  res.status(200).json({
    stat: "OK",
    doughnut: { ctr: 10, cr_media: 3, cr_projects: 5 },
    line: [12, 19, 3, 5, 2, 3, 5],
    days: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Orange"],
  });
}
