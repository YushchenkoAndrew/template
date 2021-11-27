import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import sessionConfig from "../../../config/session";
import { FullResponse } from "../../../types/request";
import { apiUrl } from "../../../config";
import { sendLogs } from "../../../lib/api/bot";
import { ApiAuth } from "../../../lib/api/auth";
import { ApiError, ApiRes, FileData, LinkData } from "../../../types/api";

type ArgsType = { id: number; links: { [name: string]: string } };

function SendData(req: NextApiRequest & { session: Session }, args: ArgsType) {
  return new Promise<FullResponse>((resolve, reject) => {
    ApiAuth()
      .then((access) => {
        fetch(`${apiUrl}/link/list/${args.id}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bear ${access}`,
          },
          body: JSON.stringify(
            Object.entries(args.links).reduce(
              (acc, [Name, Link]) => [...acc, { Name, Link }] as LinkData[],
              [] as LinkData[]
            )
          ),
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
      });
  });
}

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  // TODO: Create PUT request handler
  if (req.method !== "POST" && req.method !== "PUT" && req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let id = Number(req.query["id"] as string);
  let links = req.body as { [name: string]: string };
  if (isNaN(id) || !links) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  const { status, send } = await SendData(req, { id, links });
  res.status(status).send(send);
},
sessionConfig);
