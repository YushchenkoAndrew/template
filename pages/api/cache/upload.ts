import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import md5 from "../../../lib/md5";
import { ApiTokens, ApiError } from "../../../types/api";
import { apiHost, botHost } from "../../../config";
import { formatDate } from "../../info";
import { PassValidate } from "../../../lib/auth";
import { getValue } from "../../../lib/mutex";
import { LogMessage } from "../../../types/bot";
import { sendLogs } from "../../../lib/bot";

type QueryParams = { id: string };

function UpdateTokens(data: ApiTokens) {
  redis.set("API:Access", data.access_token);
  redis.set("API:Refresh", data.refresh_token);

  redis.expire("API:Access", 15 * 60);
  redis.expire("API:Refresh", 7 * 24 * 60 * 60);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).send("");
  }

  let key = (req.query.key ?? "") as string;
  if (!PassValidate(key, process.env.ACCESS_KEY ?? "")) {
    sendLogs({
      stat: "OK",
      name: "WEB",
      file: "/api/cache/upload.ts",
      message: "Someone tried to reach this handler. You'll will no pass!!",
    });
    return res.status(401).send("");
  }

  const now = formatDate(new Date());
  new Promise((resolve, reject) => {
    redis.get("API:Access", (err, reply) => {
      if (!err && reply) return resolve(reply);

      // If Access token expired, then refresh token
      redis.get("API:Refresh", (err, reply) => {
        if (!err && reply) {
          return fetch(`http://${apiHost}/api/refresh`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              refresh_token: reply,
            }),
          })
            .then((res) => res.json())
            .then((data: ApiTokens | ApiError) => {
              if (data.stat == "ERR")
                return reject("Incorrect refresh token value");

              UpdateTokens(data as ApiTokens);
              resolve((data as ApiTokens).access_token);
            })
            .catch((err) => reject(err));
        }

        // If Refresh token expired, then relogin
        let salt = Math.round(Math.random() * 10000).toString();
        fetch(`http://${apiHost}/api/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            user: process.env.API_USER ?? "",
            pass:
              salt +
              "$" +
              md5(
                (process.env.API_PEPPER ?? "") +
                  salt +
                  (process.env.API_PASS ?? "")
              ),
          }),
        })
          .then((res) => res.json())
          .then((data: ApiTokens | ApiError) => {
            if (data.stat == "ERR") return reject("Incorrect user or pass");

            UpdateTokens(data as ApiTokens);
            resolve((data as ApiTokens).access_token);
          })
          .catch((err) => reject(err));
      });
    });
  })
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
