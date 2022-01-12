import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export interface K3sFieldProps {
  name: string;
  show?: boolean;
  onHide?: () => void;
  children?: React.ReactNode;
}

export interface K3sFieldRef {}

export default React.forwardRef((props: K3sFieldProps, ref) => {
  return (
    <>
      <hr className="mb-4" />
      <div className="row" onClick={props.onHide}>
        <h4 className="font-weight-bold mr-2">{props.name}</h4>
        <FontAwesomeIcon
          icon={props.show ? faChevronDown : faChevronRight}
          className="my-1"
          fontSize="1rem"
        />
      </div>
      <div className="row justify-content-center">{props.children}</div>
    </>
  );
});
