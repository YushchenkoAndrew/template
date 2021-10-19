import { withIronSession } from "next-iron-session";
import React from "react";
import SignIn from "../../components/admin/SignIn";
import DefaultHead from "../../components/default/DefaultHead";
import sessionConfig from "../../config/session";
import { NextSessionArgs } from "../../types/session";
import { checkIfUserExist } from "../../lib/session";
import { basePath } from "../../config";
import { useRouter } from "next/dist/client/router";

export default function Login() {
  const router = useRouter();
  const basePath = router.basePath;

  return (
    <>
      <DefaultHead>
        <title>Login</title>
      </DefaultHead>

      <div className="container text-center">
        <div className="h-100 justify-content-center">
          <SignIn title="Welcome back" desc="Sign in to go further" />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withIronSession(async function ({
  req,
  res,
}: NextSessionArgs) {
  const sessionID = req.session.get("user");
  const isOk = await checkIfUserExist(sessionID);

  if (sessionID && isOk) {
    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin`,
        permanent: false,
      },
    };
  }

  return { props: {} };
},
sessionConfig);
