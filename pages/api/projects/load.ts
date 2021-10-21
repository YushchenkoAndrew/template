import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { apiHost } from "../../../config";
import redis from "../../../config/redis";
import { createQuery } from "../../../lib/query";
import { ApiError, ApiRes, ProjectData } from "../../../types/api";
import { FullResponse } from "../../../types/request";

export function LoadProjects(args: { [key: string]: number | string }) {
  return new Promise<FullResponse>((resolve, reject) => {
    const query = createQuery(args);
    redis.get(`Project:${query}`, (err, result) => {
      if (!err && result) {
        console.log("HERE " + query);

        return resolve({
          status: 200,
          send: {
            status: "OK",
            message: "Success",
            result: JSON.parse(result),
          },
        });
      }

      fetch(`http://${apiHost}/api/project${query}`)
        .then((res) => res.json())
        .then((data: ApiRes<ProjectData> | ApiError) => {
          if (data.status !== "OK" || !data.result.length) {
            return resolve({
              status: data.status === "ERR" ? 500 : 416,
              send: {
                status: "ERR",
                message: (data as ApiError).message || "Empty result",
              },
            });
          }

          resolve({
            status: 200,
            send: {
              status: data.status,
              message: data.status === "OK" ? "Success" : "Error",
              result: data.result,
            },
          });

          redis.set(`Project:${query}`, JSON.stringify(data.result));
          redis.expire(`Project:${query}`, 2 * 60 * 60);
        })
        .catch((err) => {
          resolve({
            status: 500,
            send: {
              status: "ERR",
              message: "Error",
            },
          });
        });
    });
  });
}

export default async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let role = req.query["role"] as string;
  let id = Number(req.query["id"] as string);
  let page = Number(req.query["page"] as string);

  if (isNaN(page) && isNaN(id)) {
    return res.status(400).send({ stat: "ERR", message: "Bad 'page' param" });
  }

  const { status, send } = await LoadProjects({ id, role, page });
  res.status(status).send(send);
}