import type { NextApiRequest, NextApiResponse } from "next";
import { getValue, setValue } from "../../../lib/mutex";
import redis from "../../../config/redis";
import { apiUrl } from "../../../config";
import { ApiRes, GeoIpLocationData, WorldData } from "../../../types/api";
import { sendLogs } from "../../../lib/bot";
import md5 from "../../../lib/md5";
import { FullResponse } from "../../../types/request";

function finalValue(key: string) {
  return new Promise<string>((resolve, reject) => {
    redis.get(key, (err, reply) => {
      // replay always will have value in this step
      if (reply && !err) return resolve(reply ?? "");

      fetch(`${apiUrl}/world?page=-1`)
        .then((res) => res.json())
        .then((res: ApiRes<WorldData>) => {
          if (!res.items || res.status == "ERR")
            return reject("Idk something wrong happened at then backend");

          // Need this just to decrease space usage in RAM
          let result = {} as { [country: string]: number };
          res.result.forEach((item) => (result[item.Country] = item.Visitors));

          resolve(JSON.stringify(result));
        })
        .catch((err) => reject(err));
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("");

  const date = new Date();
  const now = date.getTime() - date.getTimezoneOffset() * 60000;
  const prev = Number(req.headers["x-custom-header"]);
  const ip = req.headers["x-custom-ip"];
  if (isNaN(prev) || now < prev || now - prev >= 5000 || !ip)
    return res.status(400).send("Nop");

  const hash = md5(prev.toString());
  const { status, send } = await new Promise<FullResponse>(
    (resolve, reject) => {
      redis.get(`RAND:${hash}`, (err, ok) => {
        if (err || !ok) return res.status(400).send("RAND");
        redis.del(`RAND:${hash}`);

        fetch(`${apiUrl}/trace/${ip}`)
          .then((res) => res.json())
          .then((data: ApiRes<GeoIpLocationData>) => {
            if (data.status === "ERR") {
              return resolve({
                status: 500,
                send: {
                  status: "ERR",
                  message: "Hold up it's not my fault ... kinda",
                },
              });
            }

            const user = {
              id: md5(
                (Math.random() * 100000 + 500).toString() +
                  data.result[0].CountryIsoCode +
                  now.toString()
              ),
              country: data.result[0].CountryIsoCode,
              expired: now + 86.4e6,
              salt: md5((Math.random() * 100000 + 500).toString()),
            };

            console.log("user: ");
            console.log(user);

            resolve({
              status: 201,
              send: {
                status: "OK",
                message: "Success",
                result: user,
              },
            });

            // Run in background
            setTimeout(() => {
              redis.set(user.id, user.country);
              redis.expire(user.id, user.expired);
              redis.hincrby("Info:Now", "Visitors", 1);
              redis.hincrby("Info:Now", "Views", 1);

              // Need this for detect curr day countries
              redis.lpush("Info:Countries", user.country);

              // Use simple mutex handler for changing variables with kubernetes & docker
              getValue("Info:World", finalValue("Info:World"))
                .then((str: string) => {
                  let data = JSON.parse(str);
                  data[user.country] = data[user.country]
                    ? data[user.country] + 1
                    : 1;
                  setValue("Info:World", JSON.stringify(data));
                })
                .catch((err) =>
                  sendLogs({
                    stat: "ERR",
                    name: "WEB",
                    file: "/api/view/user.ts",
                    message: "Ohhh noooo, Cache is broken!!!",
                    desc: err,
                  })
                );
            }, 0);
          })
          .catch((err) => {
            resolve({
              status: 500,
              send: {
                status: "ERR",
                message:
                  "F@$k, I fixed this yeasted, why it's still not working !!!!",
              },
            });
          });
      });
    }
  );

  return res.status(status).send(send);
}
