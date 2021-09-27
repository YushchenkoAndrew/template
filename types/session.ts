import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";

export type NextSessionArgs = {
  req: NextApiRequest & { session: Session };
  res: NextApiResponse;
};
