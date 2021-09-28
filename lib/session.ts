import { withIronSession } from "next-iron-session";
import sessionConfig from "../config/session";
import { NextSessionArgs } from "../types/session";

export default withIronSession(async function ({ req, res }: NextSessionArgs) {
  if (!req.session.get("user")) {
    return {
      redirect: {
        basePath: false,
        destination: "/projects/admin/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}, sessionConfig);
