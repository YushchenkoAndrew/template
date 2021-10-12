import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";

type PromiseReturn = {
  code: number;
  data: string;
};

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  // TODO: Send request to API
  console.log(req.body);
  res.status(200).send({ id: 52 });
},
sessionConfig);
