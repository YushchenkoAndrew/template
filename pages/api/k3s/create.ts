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
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const type = GetParam(req.query.type);
  const namespace = GetParam(req.query.namespace ?? "");
  if (
    !type ||
    (type !== "namespace" && !namespace) ||
    !process.env.K3S_ALLOWED_TYPES?.includes?.(type)
  ) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await new Promise<FullResponse>((resolve) => {
    ApiAuth()
      .then((access) => {
        fetch(`${apiUrl}/k3s/${type}/${namespace}`, {
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
  });

  res.status(status).send(send);
},
sessionConfig);
