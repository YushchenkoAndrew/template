import fs from "fs";
import { File, IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";
import FormData from "form-data";
import { FullResponse } from "../../../types/request";
import { fileServer } from "../../../config";
import { sendLogs } from "../../../lib/bot";
import md5 from "../../../lib/md5";

function SendFile(req: NextApiRequest & { session: Session }, path: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return resolve({
          status: 500,
          send: {
            stat: "ERR",
            message: "Something went wrong with file paring",
          },
        });
      }

      const formData = new FormData();
      formData.append(
        "file",
        fs.createReadStream((files.file as File).path),
        (files.file as File).name ?? md5(Math.random().toString())
      );

      fetch(`http://${fileServer}/files?path=${path}`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(process.env.FILE_SERVER_AUTH ?? "").toString("base64"),
        },
        body: formData as any,
      })
        .then((res) => res.json())
        .then((data) =>
          resolve({
            status: 200,
            send: {
              stat: data.status ?? "ERR",
              message: data.message ?? "What's wrong with you, File Server",
            },
          })
        )
        .catch((err) => {
          resolve({
            status: 500,
            send: {
              stat: "ERR",
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
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let id = Number(req.query["id"] as string);
  let path = req.query["path"] as string;
  if (!path || isNaN(id)) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  // TODO: Send request to API about a new file

  const { status, send } = await SendFile(req, path);
  res.status(status).send(send);
},
sessionConfig);
