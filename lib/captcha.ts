import redis from "../config/redis";
import { FullResponse } from "../types/request";
import { sendLogs } from "./bot";

export function checkCaptcha(id: string, captcha: string, secrete: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    redis.get(id, (err, reply) => {
      if (err) {
        return resolve({
          status: 403,
          send: {
            status: "ERR",
            message: "Man, who the heck are you ?",
          },
        });
      }

      fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secrete}&response=${captcha}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          resolve({
            status: 200,
            send: {
              status: data.success ? "OK" : "ERR",
              message: data.success ? "Success!!" : "You are a ROBOT !!!",
            },
          });

          if (!data.success) {
            sendLogs({
              stat: "ERR",
              name: "WEB",
              file: "/api/admin/captcha.ts",
              message: "Robot is parsing my site !!!",
              desc: data,
            });
          }
        })
        .catch((err) => {
          resolve({
            status: 500,
            send: {
              status: "ERR",
              message: "Stooopp breaking stuff MAAANN !!",
            },
          });
        });
    });
  });
}
