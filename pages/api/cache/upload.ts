import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { apiUrl } from "../../../config";
import { formatDate } from "../../info";
import { ApiAuth, PassValidate } from "../../../lib/api/auth";
import { freeMutex, waitMutex } from "../../../lib/api/mutex";
import { sendLogs } from "../../../lib/api/bot";
import getConfig from "next/config";
import { DefaultRes } from "../../../types/request";
import { ApiError, ApiRes, InfoData, WorldData } from "../../../types/api";
import md5 from "../../../lib/md5";

const { serverRuntimeConfig } = getConfig();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("");

  let send = [];
  const key = (req.query.key as string) || "";
  const salt = req.headers["x-custom-header"] || "";
  if (
    !PassValidate(
      key,
      md5(salt + serverRuntimeConfig.WEB_PEPPER + serverRuntimeConfig.WEB_KEY)
    )
  ) {
    sendLogs({
      stat: "OK",
      name: "WEB",
      file: "/api/cache/upload.ts",
      message: "Someone tried to reach this handler. You'll will no pass!!",
    });
    return res.status(401).send("");
  }

  try {
    const now = formatDate(new Date());
    const access = await ApiAuth();
    send = await Promise.all([
      new Promise<DefaultRes>((resolve, reject) => {
        waitMutex().then(() => {
          redis.hgetall("Info:Now", (err, reply) => {
            freeMutex();
            if (err || !reply) {
              return resolve({
                status: "ERR",
                message: "Key Info:Now is empty",
              });
            }

            redis.lrange("Info:Countries", 0, -1, (err, countries) => {
              if (err || !countries || countries.length == 0) {
                return resolve({
                  status: "ERR",
                  message: "Key Info:Countries is empty",
                });
              }

              // Visitor Stat Update
              fetch(`${apiUrl}/info/${now}`, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bear ${access}`,
                },
                body: JSON.stringify({
                  Countries: countries
                    .reduce(
                      (acc, curr) =>
                        !acc.includes(curr) ? [...acc, curr] : acc,
                      [] as string[]
                    )
                    .join(","),
                  Views: +(reply.Views ?? 0),
                  Clicks: +(reply.Clicks ?? 0),
                  Media: +(reply.Media ?? 0),
                  Visitors: +(reply.Visitors ?? 0),
                }),
              })
                .then((res) => res.json())
                .then((data: ApiRes<InfoData[]> | ApiError) => {
                  resolve({
                    status: data.status,
                    message: (data as ApiError).message ?? "Success",
                    result: data,
                  });
                })
                .catch((err) =>
                  resolve({
                    status: "ERR",
                    message: err,
                  })
                );
            });
          });
        });
      }),

      // Update World Table
      new Promise<DefaultRes>((resolve, reject) => {
        waitMutex().then(() => {
          redis.get("Info:World", (err, reply) => {
            freeMutex();
            if (err || !reply) {
              return resolve({
                status: "ERR",
                message: "Key Info:World is empty",
              });
            }

            const data = JSON.parse(reply);
            if (Object.keys(data).length == 0) return;
            fetch(`${apiUrl}/world/list`, {
              method: "POST",
              headers: {
                Authorization: `Bear ${access}`,
                "content-type": "application/json",
              },
              body: JSON.stringify(
                Object.entries(data).map(([Country, Visitors]) => ({
                  Country,
                  Visitors,
                }))
              ),
            })
              .then((res) => res.json())
              .then((data: ApiRes<WorldData[]> | ApiError) => {
                resolve({
                  status: data.status,
                  message: (data as ApiError).message ?? "Success",
                  result: data,
                });
              })
              .catch((err) =>
                resolve({
                  status: "ERR",
                  message: err,
                })
              );
          });
        });
      }),
    ]);
  } catch (err) {
    send = [
      {
        status: "ERR",
        message: err,
      },
    ];
  }

  res.status(200).send(send);
}
