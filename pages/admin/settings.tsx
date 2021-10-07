import { withIronSession } from "next-iron-session";
import React from "react";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import defaultServerSideHandler from "../../lib/session";

export default function AdminSettings() {
  return (
    <>
      <DefaultHead>
        <title>Settings</title>
      </DefaultHead>
      <DefaultHeader />
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
