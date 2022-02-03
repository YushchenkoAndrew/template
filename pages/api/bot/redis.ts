import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../config/redis";
import { PassValidate } from "../../../lib/api/auth";
import { sendLogs } from "../../../lib/api/bot";
import getConfig from "next/config";
import md5 from "../../../lib/md5";
import { FullResponse } from "../../../types/request";
import { GetParam } from "../../../lib/api/query";

const { serverRuntimeConfig } = getConfig();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).send("");

  const key = GetParam(req.query.key);
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
      file: "/api/cache/reset.ts",
      message: "Someone tried to reach this handler. You'll will no pass!!",
    });
    return res.status(401).send("");
  }

  if (!req.body["command"]) {
    return res
      .status(400)
      .send({ status: "ERR", message: "Command not specified" });
  }

  const words = req.body["command"].split(" ");
  const { status, send } = await new Promise<FullResponse>(
    (resolve, reject) => {
      redis.sendCommand(words[0], words.slice(1), (err, reply) => {
        resolve({
          status: err ? 500 : 200,
          send: {
            status: err ? "ERR" : "OK",
            message: err?.message || "Success",
            result: reply,
          },
        });
      });
    }
  );

  res.status(status).send(send);
}
