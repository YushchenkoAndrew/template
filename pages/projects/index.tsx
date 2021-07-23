import Head from "next/head";
import  React from "react";
import NavBar from "../../components/NavBar";
import NavItem from "../../components/NavItem";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Mortis Home</title>
        <meta name="author" content="Andrew Y" />
        <meta name="description" content="Site with projects examples" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar>
          <NavItem name="Home" href="/projects" active={true} />
          <NavItem name="API" href="/api/doc" />
          <NavItem name="Projects" href="/projects/projects" />
          <NavItem name="Info" href="/projects/info" />
        </NavBar>


      </main>

      <footer>
      </footer>
    </div>
  );
}

