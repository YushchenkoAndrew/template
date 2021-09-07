import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import md5 from "../../../lib/md5";
import { ApiTokens, ApiError } from "../../../types/api";
import { DefaultRes } from "../../../types/request";
import { apiHost } from "../../../config";
import { formatDate } from "../../info";
import { PassValidate } from "../../../lib/auth";

type QueryParams = { id: string };

function UpdateTokens(data: ApiTokens) {
  console.log(data);

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
      console.log(access);

      redis.hgetall("Info:Now", (err, reply) => {
        if (err || !reply) return;

        redis.lrange("Info:Countries", 0, -1, (err, countries) => {
          if (err || !countries) return;

          console.log(reply);
          console.log(countries);

          // Visitor Stat Update
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
            .then((data) => console.log(data))
            .catch((err) => console.log(err));

          // Visited Countries Update
          fetch(`http://${apiHost}/api/world/${now}`, {
            method: "POST",
            headers: {
              Authorization: `Bear ${access}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              Country: countries.join(","),
              Visitors: +(reply.Visitors ?? 0),
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        });
      });
    })
    .catch((err) => console.log(err));

  res.status(204).send("");
}
