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

    if (
      !req.query.type ||
      !process.env.K3S_ALLOWED_TYPES?.includes?.(req.query.type as string)
    ) {
      return res.status(400).send({
        status: "ERR",
        message: "This request is too bad to be a true one",
      });
    }

    console.dir(req.body, { depth: null });
    const { status, send } = await new Promise<FullResponse>(
      (resolve, reject) => {
        ApiAuth()
          .then((access) => {
            // FIXME: Some requests to API are required to have namespace field !!!
            fetch(`${apiUrl}/k3s/${req.query.type}/test`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Authorization: `Bear ${access}`,
              },
              body: JSON.stringify(req.body),
            })
              .then((res) => res.json())
              .then((result: DefaultRes) => {
                resolve({
                  status: result.status == "OK" ? 200 : 500,
                  send: {
                    status: result.status,
                    message: result.message,
                    result,
                  },
                });
              })
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
