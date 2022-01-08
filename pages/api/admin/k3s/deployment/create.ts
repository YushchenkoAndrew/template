import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import getConfig from "next/config";
// import { K3sConfigFile } from "../../../../../config/k3s";
import { DefaultRes } from "../../../../../types/request";

const { serverRuntimeConfig } = getConfig();

export default withIronSession(
  async function (
    req: NextApiRequest & { session: Session },
    res: NextApiResponse<DefaultRes>
  ) {
    if (req.method !== "POST") {
      return res.status(405).send({ status: "ERR", message: "Unknown method" });
    }

    // const kube = new KubeConfig();
    // kube.loadFromOptions(K3sConfigFile);

    // const api = kube.makeApiClient(CoreV1Api);
    // api.listNamespace().then((res) => {
    //   console.log("YESSSSSSSSSSSSSSSSSs");
    //   console.dir(res.body, { depth: null });
    // });

    res.status(200).send({} as any);
  },
  {
    cookieName: "SESSION_ID",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(serverRuntimeConfig.SESSION_TTL ?? 3600),
    },
    password: serverRuntimeConfig.APPLICATION_SECRET ?? "",
  }
);
