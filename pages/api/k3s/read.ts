import { apiUrl } from "../../../config/index";
import { DefaultRes, FullResponse } from "../../../types/request";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { ApiAuth } from "../../../lib/api/auth";
import { GetParam } from "../../../lib/api/query";
import sessionConfig from "../../../config/session";

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const type = GetParam(req.query.type);
  const namespace = GetParam(req.query.namespace ?? "");
  const prefix = GetParam(req.query.prefix ?? "");
  if (!type || !namespace || !process.env.K3S_ALLOWED_TYPES?.includes?.(type)) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await new Promise<FullResponse>((resolve) => {
    ApiAuth()
      .then((access) => {
        fetch(
          `${apiUrl}/k3s/${type}/${namespace}` +
            (prefix ? `?prefix=${prefix}` : ""),
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bear ${access}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data: DefaultRes) => {
            console.dir(data, { depth: null });
            resolve({
              status: data.status == "OK" ? 200 : 500,
              send: {
                status: data.status,
                message: data.message,
                result: data.result?.items ?? [],
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
      .catch(() =>
        resolve({
          status: 500,
          send: { status: "ERR", message: "API Auth error" },
        })
      );
  });

  res.status(status).send(send);
},
sessionConfig);
