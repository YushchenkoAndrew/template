import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";
import { apiUrl, localVoidUrl } from "../../../config";
import redis from "../../../config/redis";
import { formPath } from "../../../lib/public/files";
import { createQuery } from "../../../lib/api/query";
import { ApiError, ApiRes, FileData, ProjectData } from "../../../types/api";
import { DefaultRes, FullResponse } from "../../../types/request";

export function LoadFile(args: { [key: string]: number | string }) {
  return new Promise<FullResponse>((resolve, reject) => {
    const query = createQuery(args);
    fetch(`${apiUrl}/file${query}`)
      .then((res) => res.json())
      .then((data: ApiRes<FileData[]> | ApiError) => {
        if (data.status !== "OK" || !data.result.length) {
          return resolve({
            status: 404,
            send: {
              status: "ERR",
              message: "File not found",
            },
          });
        }

        fetch(
          `${localVoidUrl}/${args.project}${formPath(
            data.result[0] as FileData
          )}`
        )
          .then((res) => res.text())
          .then((text) =>
            resolve({
              status: 200,
              send: {
                status: "OK",
                message: "Success",
                result: text,
              },
            })
          )
          .catch((err) =>
            resolve({
              status: 500,
              send: {
                status: "ERR",
                message: "Server Side error",
              },
            })
          );

        // TODO: Save in Redis !!!
        // redis.set(`Project:${query}`, JSON.stringify(data.result));
        // redis.expire(`Project:${query}`, 2 * 60 * 60);
      })
      .catch((err) =>
        resolve({
          status: 500,
          send: {
            status: "ERR",
            message: "Server Side error",
          },
        })
      );
  });
}

export default async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<DefaultRes>
) {
  if (req.method !== "GET") {
    return res.status(405).send({ status: "ERR", message: "Unknown method" });
  }

  const project = req.query["project"] as string;
  const role = req.query["role"] as string;

  if (!project) {
    return res
      .status(400)
      .send({ status: "ERR", message: "Bad 'project' param" });
  }

  const { status, send } = await LoadFile({ project, role });
  res.status(status).send(send);
}
