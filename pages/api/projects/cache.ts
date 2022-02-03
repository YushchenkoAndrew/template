import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";
import { GetParam } from "../../../lib/api/query";
import { FullResponse } from "../../../types/request";

function GetData(id: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    redis.get(`CACHE:${id}`, (err, data) => {
      resolve({
        status: 200,
        send: {
          status: err || !data ? "ERR" : "OK",
          message: "",
          result: err || !data ? "" : JSON.parse(data),
        },
      });

      if (!err && data) redis.expire(`CACHE:${id}`, 300);
    });
  });
}

function SaveData(id: string, data: string) {
  return new Promise<FullResponse>((resolve, reject) => {
    redis.set(`CACHE:${id}`, data, (err, reply) => {
      resolve({
        status: 200,
        send: {
          status: reply === "OK" ? "OK" : "ERR",
          message: "",
        },
      });
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

  const id = GetParam(req.query.id);
  if (!id) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  let { status, send } =
    req.method === "GET" ? await GetData(id) : await SaveData(id, req.body);

  res.status(status).send(send);
},
sessionConfig);
