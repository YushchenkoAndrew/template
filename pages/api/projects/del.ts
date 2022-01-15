import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { apiUrl, localVoidUrl } from "../../../config";
import sessionConfig from "../../../config/session";
import { ApiAuth } from "../../../lib/api/auth";
import { sendLogs } from "../../../lib/api/bot";
import { ApiRes, ApiError, ProjectData } from "../../../types/api";
import { DefaultRes, FullResponse } from "../../../types/request";
import getConfig from "next/config";
import { FlushValue } from "../../../config/redis";
const { serverRuntimeConfig } = getConfig();

function VoidDelFile(path: string) {
  return new Promise<boolean>((resolve, reject) => {
    fetch(`${localVoidUrl}?path=/${path}`, {
      method: "DELETE",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(serverRuntimeConfig.VOID_AUTH ?? "").toString("base64"),
      },
    })
      .then((res) => res.json())
      .then((data: DefaultRes) => {
        console.log(data);

        resolve(data.status === "OK");
      })
      .catch(() => resolve(false));
  });
}

function DelProject(project: string, flag: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`${apiUrl}/project/${project}`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
        })
          .then((res) => res.json())
          .then((data: ApiRes<ProjectData[]> | ApiError) => {
            if (data.status !== "OK") {
              return resolve({
                status: 500,
                send: {
                  status: "ERR",
                  message: (data as ApiError).message,
                },
              });
            }

            if (flag == "Link") {
              return resolve({
                status: 200,
                send: { status: "OK", message: "Success" },
              });
            }

            VoidDelFile(project).then((ok) => {
              resolve({
                status: ok ? 200 : 500,
                send: {
                  status: ok ? "OK" : "ERR",
                  message: ok ? "Success" : "Void error",
                },
              });
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
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const project = req.query["project"] as string;
  const flag = req.query["flag"] as string;
  if (!project || !flag) {
    return res
      .status(400)
      .send({ status: "ERR", message: "Not all required fields are setted" });
  }

  const { status, send } = await DelProject(project, flag);
  if (send.status === "OK") FlushValue("Project");
  res.status(status).send(send);
},
sessionConfig);
