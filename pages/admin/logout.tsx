import { withIronSession } from "next-iron-session";
import React from "react";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import sessionConfig from "../../config/session";
import { NextSessionArgs } from "../../types/session";

export default function Logout() {
  return (
    <>
      <DefaultHead>
        <title>Logout</title>
      </DefaultHead>
    </>
  );
}

export const getServerSideProps = withIronSession(async function ({
  req,
  res,
}: NextSessionArgs) {
  if (!req.session.get("user")) {
    return {
      redirect: {
        basePath: false,
        destination: "/projects/admin/login",
        permanent: false,
      },
    };
  }

  await req.session.destroy();
  return {
    redirect: {
      basePath: false,
      destination: "/projects/",
      permanent: false,
    },
  };
},
sessionConfig);
