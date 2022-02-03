import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import getConfig from "next/config";
import { localVoidUrl } from "../../../config";
import sessionConfig from "../../../config/session";
import { GetParam } from "../../../lib/api/query";
import { GetServerIP } from "../../../lib/api/ip";

const { serverRuntimeConfig } = getConfig();

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse<string>
) {
  if (req.method !== "POST") return res.status(405).send("");

  const tag = GetParam(req.query.tag);
  const path = GetParam(req.query.path);
  if (!tag || !path) {
    return res.status(400).send("");
  }

  const data = await new Promise<string>((resolve) => {
    fetch(`${localVoidUrl}/docker?path=/${path}&t=${tag}&push`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(serverRuntimeConfig.VOID_AUTH ?? "").toString("base64"),
      },
    })
      .then((res) => res.text())
      .then((data) => resolve(data))
      .catch(() => resolve(""));
  });

  if (!data) return res.send(data);
  await new Promise<void>((resolve) => {
    GetServerIP().then((serveraddress) => {
      fetch(`${localVoidUrl}/docker/push?t=${tag}&`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(serverRuntimeConfig.VOID_AUTH ?? "").toString("base64"),
          "X-Registry-Auth": Buffer.from(
            JSON.stringify({
              username: serverRuntimeConfig.DOCKER_USER,
              password: serverRuntimeConfig.DOCKER_PASS,
              email: serverRuntimeConfig.DOCKER_EMAIL,
              serveraddress,
            })
          ).toString("base64"),
        },
      })
        .then(() => resolve())
        .catch(() => resolve());
    });
  });

  res.send(data);
},
sessionConfig);
