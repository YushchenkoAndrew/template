import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import sessionConfig from "../../../config/session";
import { DefaultRes, FullResponse } from "../../../types/request";
import { apiUrl } from "../../../config";
import { sendLogs } from "../../../lib/api/bot";
import { ApiAuth } from "../../../lib/api/auth";
import { ApiError, ApiRes, FileData } from "../../../types/api";
import { createQuery, GetParam } from "../../../lib/api/query";
import { FlushValue } from "../../../config/redis";

type ArgsType = {
  id: number | null;
  project_id: number;
};

function DelLink(args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`${apiUrl}/link${createQuery(args)}`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
        })
          .then((res) => res.json())
          .then((data: ApiRes<FileData[]> | ApiError) => {
            resolve({
              status: data.status !== "OK" ? 500 : 200,
              send: {
                status: data.status,
                message:
                  data.status !== "OK" ? (data as ApiError).message : "Success",
                result: data.result ?? [],
              },
            });
          })
          .catch((err) => {
            sendLogs({
              stat: "ERR",
              name: "WEB",
              file: "/api/admin/link.ts",
              message: "Bruhh, something is broken and it's not me!!!",
              desc: err,
            });

            return resolve({
              status: 500,
              send: { status: "ERR", message: "Server error" },
            });
          });
      })
      .catch((err) => {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/admin/link.ts",
          message: "Bruhh, something is broken and it's not me!!!",
          desc: err,
        });

        return resolve({
          status: 500,
          send: { status: "ERR", message: "Server error" },
        });
      });
  });
}

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const id = Number(GetParam(req.query.id));
  const projectId = Number(GetParam(req.query.project_id));
  if (isNaN(projectId)) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await DelLink({
    id: id || null,
    project_id: projectId,
  });
  if (send.status === "OK") FlushValue("Project");
  res.status(status).send(send);
},
sessionConfig);
