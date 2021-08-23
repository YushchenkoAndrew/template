import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultRes, Stat as StatMessage } from "../ping";

type QueryParams = { date: string };

export type Country = { country: string; value: number };
export type Stat = { value: number; gain: number };
export type StatInfo = { users: Stat; views: Stat; countries: number };

export type Data = {
  stat: StatMessage;
  info: StatInfo;
  map: Country[];
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

  let { date } = req.query as QueryParams;
  if (!date) {
    return res
      .status(400)
      .json({ stat: "ERR", message: "Not all Query params are declared!" });
  }

  // TODO: Get data from API
  console.log(date);

  res.status(200).json({
    stat: "OK",
    info: {
      users: { value: 25, gain: -64 },
      views: { value: 155, gain: 64 },
      countries: 55,
    },
    map: [
      { country: "cn", value: 1389618778 },
      { country: "in", value: 1311559204 },
      { country: "us", value: 331883986 },
      { country: "id", value: 264935824 },
      { country: "pk", value: 210797836 },
      { country: "br", value: 210301591 },
      { country: "ng", value: 208679114 },
      { country: "bd", value: 161062905 },
      { country: "ru", value: 141944641 },
      { country: "mx", value: 127318112 },
    ],
  });
}
