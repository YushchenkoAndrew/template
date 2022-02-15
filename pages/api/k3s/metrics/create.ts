import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { apiUrl } from "../../../../config";
import sessionConfig from "../../../../config/session";
import { ApiAuth } from "../../../../lib/api/auth";
import { GetParam } from "../../../../lib/api/query";
import { DefaultRes, FullResponse } from "../../../../types/request";

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const name = GetParam(req.query.name);
  const namespace = GetParam(req.query.name);
  const projectId = GetParam(req.query.id);
  if (!name || !namespace || !projectId) {
    return res
      .status(400)
      .send({
        status: "ERR",
        message: "This request is too bad to be a true one",
      });
  }

  const { status, send } = await new Promise<FullResponse>((resolve) => {
    ApiAuth()
      .then((access) => {
        fetch(
          `${apiUrl}/subscription?name=${name}&namespace=${namespace}&id=${projectId}`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bear ${access}`,
            },
            body: JSON.stringify({
              cron_time: "*/10 * * * * *",
              operation: "metrics",
            }),
          }
        )
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
