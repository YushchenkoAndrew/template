import type { NextApiRequest, NextApiResponse } from "next";
import { getValue, setValue } from "../../../lib/mutex";
import redis from "../../../config/redis";
import { apiHost } from "../../../config";
import { ApiRes, WorldData } from "../../../types/api";
import { sendLogs } from "../../../lib/bot";
import md5 from "../../../lib/md5";

type User = { id: string; country: string; expired: number };

function finalValue(key: string) {
  return new Promise<string>((resolve, reject) => {
    redis.get(key, (err, reply) => {
      // replay always will have value in this step
      if (reply && !err) return resolve(reply ?? "");

      fetch(`http://${apiHost}/api/world?page=-1`)
        .then((res) => res.json())
        .then((res: ApiRes) => {
          if (!res.items || res.status == "ERR")
            return reject("Idk something wrong happened at then backend");

          // Need this just to decrease space usage in RAM
          let result = {} as { [country: string]: number };
          (res.result as WorldData[]).forEach(
            (item) => (result[item.Country] = item.Visitors)
          );

          resolve(JSON.stringify(result));
        })
        .catch((err) => reject(err));
    });
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("");

  let { id, country, expired } = req.body as User;
  if (!id || !country || !expired || isNaN(+expired))
    return res.status(400).send("");

  res.status(204).send("");

  // Run in background
  setTimeout(() => {
    // TODO: Save countries
    console.log("user ");
    console.log(req.body as User);

    const now = new Date().getTime();
    const prev = Number(req.headers["x-custom-header"]);
    if (isNaN(prev) || now < prev || now - prev >= 2000) return;

    const hash = md5(prev.toString());
    redis.get(`RAND:${hash}`, (err, ok) => {
      if (err || !ok) return;
      redis.del(`RAND:${hash}`);

      redis.set(id, country);
      redis.expire(id, expired);

      redis.hincrby("Info:Now", "Visitors", 1);
      redis.hincrby("Info:Now", "Views", 1);

      // Need this for detect curr day countries
      redis.lpush("Info:Countries", country);

      // Use simple mutex handler for changing variables with kubernetes & docker
      getValue("Info:World", finalValue("Info:World"))
        .then((str: string) => {
          let data = JSON.parse(str);
          data[country] = data[country] ? data[country] + 1 : 1;
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
    });
  }, 0);
}
