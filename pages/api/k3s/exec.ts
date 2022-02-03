import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { exec } from "child_process";
import sessionConfig from "../../../config/session";

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "POST" || req.headers["content-type"] !== "text/plain") {
    return res.status(404).send("");
  }

  const text = await new Promise((resolve, reject) => {
    // FIXME: Instead of that send request to 'void' Container
    // with api /exec route ...
    exec(req.body, (error, stdout, stderr) => {
      resolve(stdout || error || stderr);
    });
  });

  res.status(200).send(text);
},
sessionConfig);
