import { withIronSession } from "next-iron-session";
import { NextSessionArgs } from "../types/session";

export default withIronSession(
  async function ({ req, res }: NextSessionArgs) {
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
  },
  {
    cookieName: "SESSION_ID",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    password: process.env.APPLICATION_SECRET ?? "",
  }
);
