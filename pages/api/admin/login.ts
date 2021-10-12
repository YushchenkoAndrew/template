import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import { PassValidate } from "../../../lib/auth";
import { sendLogs } from "../../../lib/bot";
import md5 from "../../../lib/md5";
import { LoginRequest } from "../../../types/admin";
import { DefaultRes } from "../../../types/request";

type PromiseReturn = {
  status: number;
  send: DefaultRes;
};

function checkUserInfo(id: string, salt: number, user: string, pass: string) {
  return new Promise<PromiseReturn>((resolve, reject) => {
    redis.get(id, (err, reply) => {
      if (err || !reply) {
        return resolve({
          status: 403,
          send: {
            stat: "ERR",
            message: "Man, who the heck are you ?",
          },
        });
      }

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
              stat: "ERR",
              message: "You can't go EVEN FURTHER BEYOND",
            },
          });
        }

        // Constant time check for userName && passValidation
        let equal = {
          user: PassValidate(
            md5(salt.toString() + (process.env.ADMIN_USER ?? "")),
            user
          ),
          pass: PassValidate(
            md5(salt.toString() + (process.env.ADMIN_PASS ?? "")),
            pass
          ),
        };

        if (!equal.user || !equal.pass) {
          return resolve({
            status: 401,
            send: {
              stat: "ERR",
              message: `So your name is Ms.[LOGIN], huh...`,
            },
          });
        }

        redis.set(`LOGIN:${id}`, "0");
        return resolve({
          status: 200,
          send: {
            stat: "OK",
            message: "I guess you can pass",
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
      return res.status(405).send({ stat: "ERR", message: "Unknown method" });
    }

    let id = req.query["id"] as string;
    let { salt, user, pass } = req.body as LoginRequest;
    if (!salt || !user || !pass || !id) {
      return res
        .status(400)
        .send({
          stat: "ERR",
          message: "This request is too bad to be a true one",
        });
    }

    let response = await checkUserInfo(id, salt, user, pass);
    if (response.status == 200) {
      const sessionID = md5(Math.random().toString() + id);
      redis.set(`SESSION:${sessionID}`, id);
      redis.expire(id, Number(process.env.SESSION_TTL ?? 3600));

      req.session.set("user", sessionID);

      await req.session.save();
    }

    res.status(response.status).send(response.send);
  },
  {
    cookieName: "SESSION_ID",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.SESSION_TTL ?? 3600),
    },
    password: process.env.APPLICATION_SECRET ?? "",
  }
);
