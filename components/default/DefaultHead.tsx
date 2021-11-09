import Head from "next/head";
import React from "react";
import { basePath } from "../../config";

export interface DefaultHeadProps {
  children?: React.ReactNode;
}

export default function DefaultHead(props: DefaultHeadProps) {
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
