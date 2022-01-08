import { loadYaml, V1Namespace } from "@kubernetes/client-node";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import getConfig from "next/config";
import k3s from "../../../../../config/k3s";
import { DefaultRes, FullResponse } from "../../../../../types/request";

const { serverRuntimeConfig } = getConfig();

export default withIronSession(
  async function (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<DefaultRes>
  ) {
    if (req.method !== "POST" || req.headers["content-type"] !== "text/plain") {
      return res.status(405).send({ status: "ERR", message: "Unknown method" });
    }

    try {
      const body = loadYaml(req.body) as V1Namespace;
      const { status, send } = await new Promise<FullResponse>(
        (resolve, reject) => {
          k3s
            .listNamespace()
            .then((res) => {
              for (let namespace of res.body.items) {
                if (namespace.metadata?.name !== body.metadata?.name) continue;
                return k3s
                  .replaceNamespace(body.metadata?.name ?? "", body)
                  .then((res) => {
                    resolve({
                      status: 200,
                      send: {
                        status: "OK",
                        message: "Success!!",
                        result: res.body,
                      },
                    });
                  })
                  .catch((err) => reject(err));
              }

              k3s
                .createNamespace(body)
                .then((res) => {
                  resolve({
                    status: 200,
                    send: {
                      status: "OK",
                      message: "Success!!",
                      result: res.body,
                    },
                  });
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        }
      );

      res.status(status).send(send);
    } catch (err) {
      res.status(500).send({
        status: "ERR",
        message: "k3s API error",
        result: err,
      });
    }
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
