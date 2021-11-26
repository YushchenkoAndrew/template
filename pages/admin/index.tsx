import React from "react";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import defaultServerSideHandler from "../../lib/api/session";

export default function AdminHome() {
  return (
    <>
      <DefaultHead>
        <title>Admin</title>
      </DefaultHead>
      <DefaultHeader />
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
