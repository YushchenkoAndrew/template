import React from "react";
import DefaultNavBar from "../../components/default/DefaultNavBar";
import DefaultHead from "../../components/default/DefaultHead";

export default function Info() {
  return (
    <>
      <DefaultHead>
        <title>Mortis Info</title>
      </DefaultHead>

      <header>
        <DefaultNavBar info />
      </header>

      <main></main>

      <footer></footer>
    </>
  );
}