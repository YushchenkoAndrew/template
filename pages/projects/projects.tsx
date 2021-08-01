import React from "react";
import DefaultNavBar from "../../components/default/DefaultNavBar";
import DefaultHead from "../../components/default/DefaultHead";

export default function Projects() {
  return (
    <>
      <DefaultHead>
        <title>Mortis Projects</title>
      </DefaultHead>

      <header>
        <DefaultNavBar projects />
      </header>

      <main></main>

      <footer></footer>
    </>
  );
}
