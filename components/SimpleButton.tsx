import { useRouter } from "next/dist/client/router";
import React from "react";
import Image from "react-bootstrap/Image";

export type Event = {
  href?: string;
  onClick?: () => void;
};
export interface SimpleButtonProps {
  className?: string;
  event: Event;
  children: React.ReactNode;
}

export default function SimpleButton(props: SimpleButtonProps) {
  return props.event.href ? (
    <a href={props.event.href} className={props.className}>
      {props.children}
    </a>
  ) : (
    <button onClick={props.event.onClick} className={props.className}>
      {props.children}
    </button>
  );
}
