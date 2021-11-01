import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import { PassValidate } from "../../../lib/auth";
import { sendLogs } from "../../../lib/bot";
import md5 from "../../../lib/md5";
import { LoginRequest } from "../../../types/admin";
import { DefaultRes, FullResponse } from "../../../types/request";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
function checkUserInfo(id: string, salt: number, user: string, pass: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    redis.get(`LOGIN:${id}`, (err, tries) => {
      if (err || !tries) {
        redis.set(`LOGIN:${id}`, "1");
        redis.expire(id, 8.64e4);
      } else redis.incr(`LOGIN:${id}`);

      if (Number(tries) >= 5) {
        sendLogs({
          stat: "ERR",
          name: "WEB",
          file: "/pages/api/admin/logs",
          message: "You can't go EVEN FURTHER BEYOND",
          desc: `User ${id} surpass limit of password tries`,
        });

        return resolve({
          status: 429,
          send: {
            status: "ERR",
            message: "You can't go EVEN FURTHER BEYOND",
          },
        });
      }

      // Constant time check for userName && passValidation
      let equal = {
        user: PassValidate(
          md5(salt.toString() + (serverRuntimeConfig.ADMIN_USER ?? "")),
          user
        ),
        pass: PassValidate(
          md5(salt.toString() + (serverRuntimeConfig.ADMIN_PASS ?? "")),
          pass
        ),
      };

      if (!equal.user || !equal.pass) {
        return resolve({
          status: 401,
          send: {
            status: "ERR",
            message: `So your name is Ms.[LOGIN], huh...`,
          },
        });
      }

      redis.set(`LOGIN:${id}`, "0");
      return resolve({
        status: 200,
        send: {
          status: "OK",
          message: "I guess you can pass",
        },
      });
    });
  });
}

function checkCaptcha(id: string, captcha: string) {
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
        `https://www.google.com/recaptcha/api/siteverify?secret=${serverRuntimeConfig.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
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
              message: data.success ? "" : "You are a ROBOT !!!",
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

export default withIronSession(
  async function (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<DefaultRes>
  ) {
    if (req.method !== "POST") {
      return res.status(405).send({ status: "ERR", message: "Unknown method" });
    }

    let id = req.query["id"] as string;
    let { salt, user, pass, captcha } = req.body as LoginRequest;
    if (!salt || !user || !pass || !captcha || !id) {
      return res.status(400).send({
        status: "ERR",
        message: "This request is too bad to be a true one",
      });
    }

    const { status, send } = await new Promise<FullResponse>(
      (resolve, reject) => {
        checkCaptcha(id, captcha).then((res) => {
          if (res.send.status !== "OK") resolve(res);
          checkUserInfo(id, salt, user, pass).then((res) => resolve(res));
        });
      }
    );

    if (send.status === "OK") {
      const sessionID = md5(Math.random().toString() + id);
      redis.set(`SESSION:${sessionID}`, id);
      redis.expire(id, Number(serverRuntimeConfig.SESSION_TTL ?? 3600));

      req.session.set("user", sessionID);

      await req.session.save();
    }

    res.status(status).send(send);
  },
  {
    cookieName: "SESSION_ID",
    cookieOptions: {
      secure: serverRuntimeConfig.NODE_ENV === "production",
      maxAge: Number(serverRuntimeConfig.SESSION_TTL ?? 3600),
    },
    password: serverRuntimeConfig.APPLICATION_SECRET ?? "",
  }
);
