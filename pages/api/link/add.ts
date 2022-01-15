import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import sessionConfig from "../../../config/session";
import { DefaultRes, FullResponse } from "../../../types/request";
import { apiUrl } from "../../../config";
import { sendLogs } from "../../../lib/api/bot";
import { ApiAuth } from "../../../lib/api/auth";
import { ApiError, ApiRes, FileData, LinkData } from "../../../types/api";
import { FlushValue } from "../../../config/redis";

type ArgsType = { id: number; links: { add: LinkData[]; edit: LinkData[] } };

function SendData(args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        (function UpdateLink(id: number = 0) {
          return new Promise<boolean>((resolve, reject) => {
            if (id >= args.links.edit.length) return resolve(true);
            fetch(`${apiUrl}/link/${args.links.edit[id].id}`, {
              method: "PUT",
              headers: {
                "content-type": "application/json",
                Authorization: `Bear ${access}`,
              },
              body: JSON.stringify(args.links.edit[id]),
            })
              .then((res) => res.json())
              .then((data: ApiRes<LinkData[]> | ApiError) => {
                console.log(args.links.edit[id]);
                console.log(data);
                if (data.status !== "OK") return resolve(false);
                UpdateLink(id + 1).then((ok) => resolve(ok));
              })
              .catch((err) => resolve(false));
          });
        })().then((ok) => {
          if (!ok) {
            return resolve({
              status: 500,
              send: { status: "ERR", message: "Server error" },
            });
          }

          if (!args.links.add.length) {
            return resolve({
              status: 200,
              send: { status: "OK", message: "Success" },
            });
          }

          fetch(`${apiUrl}/link/list/${args.id}`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bear ${access}`,
            },
            body: JSON.stringify(args.links.add),
          })
            .then((res) => res.json())
            .then((data: ApiRes<FileData[]> | ApiError) => {
              resolve({
                status: data.status !== "OK" ? 500 : 200,
                send: {
                  status: data.status,
                  message:
                    data.status !== "OK"
                      ? (data as ApiError).message
                      : "Success",
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

  const id = Number(req.query["id"] as string);
  const body = req.body as { [name: string]: LinkData };
  if (isNaN(id) || !body) {
    return res.status(400).send({
      status: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  let links = { add: [] as LinkData[], edit: [] as LinkData[] };
  for (let i in body) {
    if (body[i].id !== undefined) links.edit.push(body[i]);
    else links.add.push(body[i]);
  }

  const { status, send } = await SendData({ id, links });

  if (send.status == "OK") FlushValue("Project");
  res.status(status).send(send);
},
sessionConfig);
