import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { apiHost } from "../../../config";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";
import { ApiAuth } from "../../../lib/auth";
import { sendLogs } from "../../../lib/bot";
import { ApiRes, ApiError } from "../../../types/api";
import { ProjectForm } from "../../../types/projects";
import { FullResponse } from "../../../types/request";

function AddProject(body: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`http://${apiHost}/api/project`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
          body,
        })
          .then((res) => res.json())
          .then((data: ApiRes | ApiError) => {
            resolve({
              status: 200,
              send: {
                status: data.status ?? "ERR",
                message: (data as ApiError).message ?? "Success",
                result: data.result ?? [],
              },
            });
          })
          .catch((err) => {
            resolve({
              status: 500,
              send: {
                status: "ERR",
                message: err,
              },
            });
          });
      })
      .catch((err) => {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/admin/projects.ts",
          message: "Bruhh, something is broken and it's not me!!!",
          desc: err,
        });
      });
  });
}

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let id = req.query["id"] as string;
  let { name, flag, title, desc, link } = req.body as ProjectForm;
  if (!id || !name || !flag || !title || !desc) {
    return res
      .status(400)
      .send({ stat: "ERR", message: "Not all required fields are setted" });
  }

  const { status, send } = await AddProject(
    JSON.stringify({ name, flag, title, desc, link })
  );

  if (send.status === "OK") redis.del(`CACHE:${id}`);
  res.status(status).send(send);
},
sessionConfig);
