import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/globals.css";
import "../styles/bootstrap.min.css";
import { useEffect } from "react";
import { basePath } from "../config";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    localStorage.getItem("id")
      ? fetch(
          `${basePath}/api/view/page?id=${localStorage.getItem("id")}&url=${
            window.location.pathname
          }`,
          {
            method: "PATCH",
          }
        )
          .then((res) => null)
          .catch((err) => null)
      : null;
  }, []);
  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`${basePath}/fonts/4bitfont.ttf`}
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href={`${basePath}/fonts/3Dventure.ttf`}
          as="font"
          crossOrigin=""
        />
        <script defer src={`${basePath}/js/lib/md5.js`}></script>
        {/* <script defer src={`${basePath}/js/ip.js`}></script> */}
        <script defer src={`${basePath}/js/lib/ip.min.js`}></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
