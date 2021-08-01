import Head from "next/head";
import React from "react";
import DefaultHead from "../../components/default/DefaultHead";
import DefaultNavBar from "../../components/default/DefaultNavBar";
import NavBar from "../../components/NavBar";
import NavItem from "../../components/NavItem";

export default function Home() {
  return (
    <div className="container">
      <DefaultHead>
        <title>Mortis Home</title>
      </DefaultHead>

      <header>
        <DefaultNavBar home />
      </header>

      <main></main>

      <footer></footer>
    </div>
  );
}
