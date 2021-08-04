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
          href="/fonts/4bitfont.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
