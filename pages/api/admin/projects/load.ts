import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";
import { apiHost } from "../../../../config";
import redis from "../../../../config/redis";
import sessionConfig from "../../../../config/session";
import { ApiError, ApiRes, ProjectData } from "../../../../types/api";
import { FullResponse } from "../../../../types/request";

function LoadProjects() {
  return new Promise<FullResponse>((resolve, reject) => {
    fetch(`http://${apiHost}/api/project`)
      .then((res) => res.json())
      .then((data: ApiRes | ApiError) => {
        resolve({
          status: 200,
          send: {
            status: data.status,
            message: data.status === "OK" ? "Success" : "Error",
            result: data.result,
          },
        });
      })
      .catch((err) => {
        resolve({
          status: 500,
          send: {
            status: "ERR",
            message: "Error",
          },
        });
      });
  });
}

export default withIronSession(async function (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).send({ stat: "ERR", message: "Unknown method" });
  }

  const { status, send } = await LoadProjects();
  res.status(status).send(send);
},
sessionConfig);
