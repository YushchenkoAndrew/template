import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";

type PromiseReturn = {
  code: number;
  data: string;
};

function GetData(id: string) {
  return new Promise<PromiseReturn>((resolve, reject) => {
    redis.get(`CACHE:${id}`, (err, data) => {
      if (err || !data) return resolve({ code: 204, data: "" });
      redis.expire(`CACHE:${id}`, 300);
      resolve({ code: 200, data: data ?? "" });
    });
  });
}

function SaveData(id: string, data: string) {
  return new Promise<PromiseReturn>((resolve, reject) => {
    redis.set(`CACHE:${id}`, data, (err, reply) => {
      if (reply !== "OK") return resolve({ code: 500, data: "" });
      resolve({ code: 201, data: "" });
    });
    redis.expire(`CACHE:${id}`, 300);
  });
}

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let id = req.query["id"] as string;
  if (!id) {
    return res
      .status(400)
      .send({
        stat: "ERR",
        message: "This request is too bad to be a true one",
      });
  }

  let { code, data } =
    req.method === "GET" ? await GetData(id) : await SaveData(id, req.body);

  res.status(code).send(data);
},
sessionConfig);
