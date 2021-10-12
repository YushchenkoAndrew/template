import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import React from "react";

export interface DefaultHeadProps {
  children?: React.ReactNode;
}

export default function DefaultHead(props: DefaultHeadProps) {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="icon" href={`${basePath}/favicon.ico`} />
      <meta charSet="utf-8" />

      <meta name="description" content="Site with projects examples" />
      <meta name="author" content="Andrew Y" />
      {props.children}
    </Head>
  );
}
