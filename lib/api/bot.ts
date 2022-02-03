import md5 from "../md5";
import { botUrl } from "../../config";
import { LogMessage } from "../../types/bot";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
export function sendLogs(body: LogMessage) {
  let salt = md5(`${Math.round(Math.random() * 100000 + 500)}`);
  fetch(
    `${botUrl}/logs/alert?key=${md5(
      salt + (serverRuntimeConfig.BOT_KEY ?? "")
    )}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Custom-Header": salt.toString(),
      },
      body: JSON.stringify(body),
    }
  ).catch((err) => console.log(err));
}
