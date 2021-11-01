import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { apiHost } from "../../../config";
import { formatDate } from "../../info";
import { ApiAuth, PassValidate } from "../../../lib/auth";
import { getValue } from "../../../lib/mutex";
import { sendLogs } from "../../../lib/bot";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("");
  }

  let key = (req.query.key ?? "") as string;
  if (!PassValidate(key, serverRuntimeConfig.ACCESS_KEY ?? "")) {
    sendLogs({
      stat: "OK",
      name: "WEB",
      file: "/api/cache/upload.ts",
      message: "Someone tried to reach this handler. You'll will no pass!!",
    });
    return res.status(401).send("");
  }

  const now = formatDate(new Date());
  ApiAuth()
    .then((access) => {
      redis.hgetall("Info:Now", (err, reply) => {
        if (err || !reply) return;

        redis.lrange("Info:Countries", 0, -1, (err, countries) => {
          if (err || !countries) return;

          // Visitor Stat Update
          if (countries.length == 0) return;
          fetch(`http://${apiHost}/api/info/${now}`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bear ${access}`,
            },
            body: JSON.stringify({
              Countries: countries
                .reduce(
                  (acc, curr) => (!acc.includes(curr) ? [...acc, curr] : acc),
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
            .catch((err) =>
              sendLogs({
                stat: "ERR",
                name: "WEB",
                url: `http://${apiHost}/api/info/${now}`,
                file: "/api/cache/upload.ts",
                message: "Something went wrong with API request;",
                desc: err,
              })
            );
        });
      });

      // Update World Table
      getValue("Info:World")
        .then((str: string) => {
          const data = JSON.parse(str);

          if (Object.keys(data).length == 0) return;
          fetch(`http://${apiHost}/api/world/list`, {
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
            .catch((err) =>
              sendLogs({
                stat: "ERR",
                name: "WEB",
                url: `http://${apiHost}/api/world/list`,
                file: "/api/cache/upload.ts",
                message: "Something went wrong with API request",
                desc: err,
              })
            );
        })
        .catch((err) =>
          sendLogs({
            stat: "ERR",
            name: "WEB",
            file: "/api/cache/upload.ts",
            message: "Something went wrong with Cache",
            desc: err,
          })
        );
    })
    .catch((err) =>
      sendLogs({
        stat: "ERR",
        name: "WEB",
        file: "/api/cache/upload.ts",
        message: "Bruhh, something is broken and it's not me!!!",
        desc: err,
      })
    );

  res.status(204).send("");
}
