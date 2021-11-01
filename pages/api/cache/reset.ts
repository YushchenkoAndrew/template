import type { NextApiRequest, NextApiResponse } from "next";
import { botHost } from "../../../config";
import redis from "../../../config/redis";
import { PassValidate } from "../../../lib/auth";
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
      file: "/api/cache/reset.ts",
      message: "Someone tried to reach this handler. You'll will no pass!!",
    });
    return res.status(401).send("");
  }

  redis.get("Mutex", function getMutex(err, reply) {
    // Init values
    if (err || !reply || Number(reply) % 2 != 0) {
      redis.set("Mutex", "1");
      redis.set("Info:World", "{}");
      return;
    }

    setTimeout(getMutex, Number(serverRuntimeConfig.MUTEX_WAIT ?? 10));
  });

  redis.hmset("Info:Now", "Views", 0, "Visitors", 0, "Clicks", 0, "Media", 0);

  // The best way just delete those vars
  redis.del("Info:Prev");
  redis.del("Info:Stat");
  redis.del("Info:Days");
  redis.del("Info:Countries");

  redis.del("API:Access");
  redis.del("API:Refresh");

  res.status(204).send("");
}
