import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/globals.css";
import "../styles/bootstrap.min.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/projects/fonts/4bitfont.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/projects/fonts/3Dventure.ttf"
          as="font"
          crossOrigin=""
        />
        <link rel="icon" href="/projects/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
