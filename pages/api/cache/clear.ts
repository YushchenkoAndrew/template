import type { NextApiRequest, NextApiResponse } from "next";
import { botHost } from "../../../config";
import redis from "../../../config/redis";
import { PassValidate } from "../../../lib/auth";
import { LogMessage } from "../../../types/bot";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).send("");
  }

  let key = (req.query.key ?? "") as string;
  if (!PassValidate(key, process.env.ACCESS_KEY ?? "")) {
    fetch(`http://${botHost}/bot/logs/info?key=${process.env.BOT_KEY ?? ""}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        stat: "OK",
        name: "WEB",
        file: "/api/cache/clear.ts",
        message: "Someone tried to reach this handler. You'll will no pass!!",
      } as LogMessage),
    });
    return res.status(401).send("");
  }

  redis.del("Mutex");
  redis.del("Info:Now");
  redis.del("Info:Prev");
  redis.del("Info:Stat");
  redis.del("Info:Days");
  redis.del("Info:World");
  redis.del("Info:Countries");

  redis.del("API:Access");
  redis.del("API:Refresh");

  res.status(204).send("");
}
