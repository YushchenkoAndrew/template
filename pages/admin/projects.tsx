import React, { useEffect, useState } from "react";
import AddCard from "../../components/admin/AddCard";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultFooter from "../../components/default/DefaultFooter";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultNav from "../../components/default/DefaultNav";
import defaultServerSideHandler from "../../lib/session";
import dynamic from "next/dynamic";
import CardStack from "../../components/admin/CardStack";

const DynamicCardStack = dynamic(
  () => import("../../components/admin/CardStack")
);

export default function AdminHome() {
  let [projects, onScrollLoad] = useState([] as JSX.Element[]);

  useEffect(() => {
    document.addEventListener("click", () => {
      // if (
      //   window.innerHeight + document.documentElement.scrollTop ===
      //   document?.scrollingElement?.scrollHeight
      // ) {
      // onLoad(true);
      console.log("HERE");
      onScrollLoad([...projects, <DynamicCardStack id={projects.length} />]);
      // }
    });
  }, []);

  return (
    <>
      <DefaultHead>
        <title>Projects</title>
      </DefaultHead>
      <DefaultHeader />

      <div className="container mt-4">
        <div className="row">
          <AddCard />
          <CardStack id={80} />
          {projects}
        </div>
      </div>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
