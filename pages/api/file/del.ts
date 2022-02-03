import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import sessionConfig from "../../../config/session";
import { DefaultRes, FullResponse } from "../../../types/request";
import { apiUrl, localVoidUrl } from "../../../config";
import { sendLogs } from "../../../lib/api/bot";
import { createQuery, GetParam } from "../../../lib/api/query";
import { ApiAuth } from "../../../lib/api/auth";
import { ApiError, ApiRes, FileData } from "../../../types/api";
import getConfig from "next/config";
import { FlushValue } from "../../../config/redis";
const { serverRuntimeConfig } = getConfig();

type ArgsType = {
  id: number | null;
  project: string;
  project_id: number;
};

function VoidDelFile(files: FileData[], args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    (function DelFile(id: number = 0) {
      return new Promise<boolean>((resolve, reject) => {
        if (id >= files.length) return resolve(true);
        fetch(
          `${localVoidUrl}?path=/${args.project}/${
            files[id].role + files[id].path
          }/${files[id].name}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(serverRuntimeConfig.VOID_AUTH ?? "").toString(
                  "base64"
                ),
            },
          }
        )
          .then((res) => res.json())
          .then((data: DefaultRes) => {
            console.log(`${args.project}/${files[id].role + files[id].path}`);

            console.log(data);

            if (data.status !== "OK") return resolve(false);
            DelFile(id + 1).then((ok) => resolve(ok));
          })
          .catch(() => resolve(false));
      });
    })()
      .then((ok) => {
        resolve({
          status: ok ? 200 : 500,
          send: {
            status: ok ? "OK" : "ERR",
            message: ok ? "Success" : "What's wrong with you, File Server",
          },
        });
      })
      .catch((err) => {
        resolve({
          status: 500,
          send: {
            status: "ERR",
            message: "Ohhh come on, another one ...",
          },
        });

        sendLogs({
          stat: "ERR",
          name: "API",
          file: "/pages/api/admin/file.ts",
          message: "And they dont stop coming and they dont stop coming...",
          desc: err,
        });
      });
  });
}

export function DelFileRecord(query: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`${apiUrl}/file/${query}`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
        })
          .then((res) => res.json())
          .then((data: ApiRes<FileData[]> | ApiError) => {
            resolve({
              status: data.status === "OK" ? 200 : 500,
              send: {
                status: data.status,
                message:
                  data.status === "OK" ? "Success" : (data as ApiError).message,
              },
            });
          })
          .catch((err) => reject());
      })
      .catch((err) => {
        reject();
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/admin/file.ts",
          message: "Bruhh, something is broken and it's not me!!!",
          desc: err,
        });
      });
  });
}

function LoadFilesInfo(args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    const query = createQuery(args);
    fetch(`${apiUrl}/file${query}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data: ApiRes<FileData[]> | ApiError) => {
        if (data.status !== "OK") {
          return resolve({
            status: 500,
            send: {
              status: "ERR",
              message: (data as ApiError).message,
            },
          });
        }

        DelFileRecord(query)
          .then((res) => {
            if (res.send.status !== "OK") return resolve(res);
            VoidDelFile(data.result as FileData[], args).then((res) =>
              resolve(res)
            );
          })
          .catch(() => {
            resolve({
              status: 500,
              send: {
                status: "ERR",
                message: "Server error",
              },
            });
          });
      })
      .catch((err) => {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/api/admin/file.ts",
          message: "Bruhh, something is broken and it's not me!!!",
          desc: err,
        });

        return resolve({
          status: 500,
          send: {
            status: "ERR",
            message: "Server error",
          },
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

  const id = Number(GetParam(req.query.id));
  const project = GetParam(req.query.project);
  const projectId = Number(GetParam(req.query.project_id));
  if (isNaN(projectId) || !project) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await LoadFilesInfo({
    id: id || null,
    project: project,
    project_id: projectId,
  });
  if (send.status === "OK") FlushValue("Project");
  res.status(status).send(send);
},
sessionConfig);
