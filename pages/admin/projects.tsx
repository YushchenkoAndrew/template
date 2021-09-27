import React from "react";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import defaultServerSideHandler from "../../lib/session";

export default function AdminHome() {
  return (
    <>
      <DefaultHead>
        <title>Projects</title>
      </DefaultHead>
      <DefaultHeader />
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
