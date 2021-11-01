import fs from "fs";
import { File, IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import sessionConfig from "../../../config/session";
import FormData from "form-data";
import { FullResponse } from "../../../types/request";
import { apiHost, fileServer } from "../../../config";
import { sendLogs } from "../../../lib/bot";
import md5 from "../../../lib/md5";
import { ApiAuth } from "../../../lib/auth";
import { ApiError, ApiRes, FileData } from "../../../types/api";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
type ArgsType = { id: number; project: string; dir: string; role: string };

function AddFile(file: File, args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`http://${apiHost}/api/file/${args.id}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
          body: JSON.stringify({
            Name: file.name ?? md5(Math.random().toString()),
            Role: args.role,
            Path: args.dir,
            Type: file.type ?? "",
          } as FileData),
        })
          .then((res) => res.json())
          .then((data: ApiRes<FileData> | ApiError) => {
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

    fetch(
      `http://${fileServer}/files?path=/${args.project}/${
        args.role + args.dir
      }`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(serverRuntimeConfig.FILE_SERVER_AUTH ?? "").toString(
              "base64"
            ),
        },
        body: formData as any,
      }
    )
      .then((res) => res.json())
      .then((data) =>
        resolve({
          status: 200,
          send: {
            status: data.status ?? "ERR",
            message: data.message ?? "What's wrong with you, File Server",
          },
        })
      )
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
  return new Promise<FullResponse>((resolve, reject) => {
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

      AddFile(files.file as File, args)
        .then((res: FullResponse) => {
          if (res.send.status !== "OK") return resolve(res);
          UploadFile(files.file as File, args)
            .then((res) => resolve(res))
            .catch((err) => {
              resolve({
                status: 500,
                send: {
                  status: "ERR",
                  message: "Ohhh come on, another one ...",
                },
              });
            });
        })
        .catch((err) => {
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
  res: NextApiResponse
) {
  // TODO: Create PUT request handler
  if (req.method !== "POST" && req.method !== "PUT" && req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let id = Number(req.query["id"] as string);
  let project = req.query["project"] as string;
  let role = req.query["role"] as string;
  let dir = (req.query["dir"] as string) ?? "";
  if (!role || !project || isNaN(id)) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await SendFile(req, { id, project, dir, role });
  res.status(status).send(send);
},
sessionConfig);
