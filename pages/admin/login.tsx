import { withIronSession } from "next-iron-session";
import React from "react";
import SignIn from "../../components/admin/SignIn";
import DefaultHead from "../../components/default/DefaultHead";
import sessionConfig from "../../config/session";
import { NextSessionArgs } from "../../types/session";
import { checkIfUserExist } from "../../lib/session";

export default function Login() {
  return (
    <>
      <DefaultHead>
        <title>Login</title>
      </DefaultHead>

      <div className="container text-center">
        {/* <div className="row align-items-center h-100">
          <div className="col-6 mx-auto"> */}
        <div className="h-100 justify-content-center">
          <SignIn title="Welcome back" desc="Sign in to go further" />
        </div>
        {/* </div>
        </div> */}
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
        destination: "/projects/admin",
        permanent: false,
      },
    };
  }

  return { props: {} };
},
sessionConfig);
