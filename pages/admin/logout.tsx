import { withIronSession } from "next-iron-session";
import React from "react";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import sessionConfig from "../../config/session";
import { NextSessionArgs } from "../../types/session";
import { checkIfUserExist } from "../../lib/session";
import redis from "../../config/redis";
import { basePath } from "../../config";
import { useRouter } from "next/dist/client/router";

export default function Logout() {
  const router = useRouter();
  const basePath = router.basePath;

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
  const sessionID = req.session.get("user");
  const isOk = await checkIfUserExist(sessionID);

  if (!sessionID || !isOk) {
    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin/login`,
        permanent: false,
      },
    };
  }

  redis.del(`SESSION:${sessionID}`);
  await req.session.destroy();

  return {
    redirect: {
      basePath: false,
      destination: basePath,
      permanent: false,
    },
  };
},
sessionConfig);
