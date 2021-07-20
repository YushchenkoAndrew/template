import '../styles/globals.css'
import type { AppProps } from "next/app";
import Head from "next/head";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My page</title>
        <link 
          href="/fonts/4bitfont.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <p>This is another paragraph.</p>
      <Component {...pageProps} />
    </>
  );
}
