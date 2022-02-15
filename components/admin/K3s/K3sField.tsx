import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styles from "./Default.module.css";

export interface K3sFieldProps {
  name: string;
  show?: boolean;
  onAdd?: () => void;
  onDel?: () => void;
  onHide?: () => void;
  children?: React.ReactNode;
}

export interface K3sFieldRef {}

export default function K3sField(props: K3sFieldProps) {
  return (
    <>
      {/* <hr className="mb-4" />
      <div className="row" onClick={props.onHide}>
        <h4 className="font-weight-bold mr-2">}</h4>
        <FontAwesomeIcon
          icon={props.show ? faChevronDown : faChevronRight}
          className="my-1"
          fontSize="1rem"
        />
      </div>
      <div className="row justify-content-center">{props.children}</div> */}

      <hr className="mb-4" />
      <div className={`container ${styles["el-index-2"]} px-0 px-sm-3`}>
        <div className="row px-3">
          <span className="row mr-auto" onClick={props.onHide}>
            <h4 className="mr-2">{props.name}</h4>
            <FontAwesomeIcon
              className="my-2"
              icon={props.show ? faChevronDown : faChevronRight}
            />
          </span>
          <div className="row mr-1">
            {props.onAdd ? (
              <a
                className={`mr-1 btn btn-outline-info ${styles["el-container-2"]}`}
                onClick={props.onAdd}
              >
                <FontAwesomeIcon
                  className={`text-info ${styles["icon"]}`}
                  icon={faPlus}
                  size="lg"
                  fontSize="1rem"
                />
              </a>
            ) : (
              <></>
            )}

            {props.onDel ? (
              <a
                className={`mr-1 btn btn-outline-danger ${styles["el-container-2"]}`}
                onClick={props.onAdd}
              >
                <FontAwesomeIcon
                  className={`text-danger ${styles["icon"]}`}
                  icon={faTrashAlt}
                  size="lg"
                  fontSize="1rem"
                  onClick={props.onDel}
                />
              </a>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="row justify-content-center mb-2">
          {props.children}
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
