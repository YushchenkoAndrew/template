import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultHeader from "../../components/default/DefaultHeader";

export default function Home() {
  return (
    <div className="container">
      <DefaultHead>
        <title>Mortis Home</title>
      </DefaultHead>

      <DefaultHeader home />

      <main></main>

      <footer></footer>
    </div>
  );
}
