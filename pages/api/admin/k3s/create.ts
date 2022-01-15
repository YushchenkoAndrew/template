import { apiUrl } from "./../../../../config/index";
import { DefaultRes, FullResponse } from "./../../../../types/request";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import getConfig from "next/config";
import { ApiAuth } from "../../../../lib/api/auth";
import YAML from "yaml";

const { serverRuntimeConfig } = getConfig();

export default withIronSession(
  async function (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<DefaultRes>
  ) {
    if (req.method !== "POST") {
      return res.status(405).send({ status: "ERR", message: "Unknown method" });
    }

    if (!req.query.type) {
      return res.status(400).send({
        status: "ERR",
        message: "This request is too bad to be a true one",
      });
    }

    const { status, send } = await new Promise<FullResponse>(
      (resolve, reject) => {
        ApiAuth()
          .then((access) => {
            fetch(`${apiUrl}/k3s/${req.query.type}`, {
              method: "POST",
              headers: {
                "content-type": "text/plain",
                Authorization: `Bear ${access}`,
              },

              body: YAML.stringify(req.body),
            })
              .then((res) => res.json)
              .then((result) =>
                resolve({
                  status: 200,
                  send: { status: "OK", message: "Success!!", result },
                })
              )
              .catch((err) =>
                resolve({
                  status: 500,
                  send: { status: "ERR", message: "API error", result: err },
                })
              );
          })
          .catch((err) =>
            resolve({
              status: 500,
              send: { status: "ERR", message: "API Auth error" },
            })
          );
      }
    );

    res.status(status).send(send);
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
