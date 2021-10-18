import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";

export type NextApiSessionRequest = NextApiRequest & { session: Session };

export type NextSessionArgs = {
  req: NextApiSessionRequest;
  res: NextApiResponse;
};
