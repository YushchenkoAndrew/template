import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import redis from "../../../config/redis";
import sessionConfig from "../../../config/session";

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  let id = Number(req.query["id"] as string);
  let path = req.query["path"] as string;
  if (!path || isNaN(id)) {
    return res.status(400).send({
      stat: "ERR",
      message: "This request is too bad to be a true one",
    });
  }

  // TODO: Send file to NGINX Server!!

  // let { code, data } =
  // req.method === "GET" ? await GetData(id) : await SaveData(id, req.body);
},
sessionConfig);
