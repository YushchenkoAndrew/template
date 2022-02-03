import fs from "fs";
import { File, IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import sessionConfig from "../../../config/session";
import FormData from "form-data";
import { DefaultRes, FullResponse } from "../../../types/request";
import { apiUrl, localVoidUrl } from "../../../config";
import { sendLogs } from "../../../lib/api/bot";
import md5 from "../../../lib/md5";
import { ApiAuth } from "../../../lib/api/auth";
import { ApiError, ApiRes, FileData } from "../../../types/api";
import getConfig from "next/config";
import { DelFileRecord } from "./del";
import { FlushValue } from "../../../config/redis";
import { GetParam } from "../../../lib/api/query";

const { serverRuntimeConfig } = getConfig();
type ArgsType = {
  id: number;
  project: string;
  path: string;
  role: string;
  fileId: number | null;
};

export function AddFileRecord(file: File, args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`${apiUrl}/file/${args.fileId || args.id}`, {
          method: args.fileId ? "PUT" : "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
          body: JSON.stringify({
            name: file.name ?? md5(Math.random().toString()),
            role: args.role,
            path: args.path,
            type: file.type ?? "",
          } as FileData),
        })
          .then((res) => res.json())
          .then((data: ApiRes<FileData[]> | ApiError) => {
            resolve({
              status: data.status ? 500 : 200,
              send: {
                status: data.status,
                message: data.status ? (data as ApiError).message : "Success",
                result: data.result ?? [],
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

function UploadFile(file: File, args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    const formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream(file.path),
      file.name ?? md5(Math.random().toString())
    );

    fetch(`${localVoidUrl}?path=/${args.project}/${args.role + args.path}`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(serverRuntimeConfig.VOID_AUTH ?? "").toString("base64"),
      },
      body: formData as any,
    })
      .then((res) => res.json())
      .then((data) => {
        resolve({
          status: 200,
          send: {
            status: data.status ?? "ERR",
            message: data.message ?? "What's wrong with you, File Server",
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

function SendFile(req: NextApiRequest & { session: Session }, args: ArgsType) {
  return new Promise<FullResponse>((resolve) => {
    const form = new IncomingForm({
      multiples: false,
    });

    form.parse(req, (err, fields, files) => {
      if (err || !files.file) {
        return resolve({
          status: 500,
          send: {
            status: "ERR",
            message: "Something went wrong with file paring",
          },
        });
      }

      AddFileRecord(files.file as File, args)
        .then((res: FullResponse) => {
          if (res.send.status !== "OK") return resolve(res);
          UploadFile(files.file as File, args)
            .then((res) => {
              if (res.send.status === "OK") return resolve(res);
              DelFileRecord(
                `?project_id=${args.id}&name=${(files.file as File).name}`
              );
            })
            .catch(() => {
              resolve({
                status: 500,
                send: {
                  status: "ERR",
                  message: "Ohhh come on, another one ...",
                },
              });
            });
        })
        .catch(() => {
          resolve({
            status: 500,
            send: {
              status: "ERR",
              message: "Something went wrong with file adding",
            },
          });
        });
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "POST") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const id = Number(GetParam(req.query.id));
  const project = GetParam(req.query.project);
  const role = GetParam(req.query.role);
  const path = GetParam(req.query.path);
  if (!role || !project || isNaN(id)) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await SendFile(req, {
    id,
    project,
    path,
    role,
    fileId: req.query.file_id ? Number(GetParam(req.query.file_id)) : null,
  });

  if (send.status == "OK") FlushValue("Project");
  res.status(status).send(send);
},
sessionConfig);
