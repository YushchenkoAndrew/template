import md5 from "./md5";
import { botHost } from "../config";
import { LogMessage } from "../types/bot";

export function sendLogs(body: LogMessage) {
  let salt = Math.round(Math.random() * 100000 + 500);
  fetch(
    `http://${botHost}/bot/logs/alert?key=${md5(
      salt + (process.env.BOT_KEY ?? "")
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
