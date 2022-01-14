import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import styles from "./Default.module.css";
import Path from "./Path";

export interface TlsProps {
  show?: boolean;
}

export interface TlsRef {}

export default React.forwardRef((props: TlsProps, ref) => {
  const [minimized, onMinimize] = useState(false);
  const [paths, onPathChange] = useState([true]);

  return (
    <div className={`border rounded mx-1 py-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate className="mx-3" label="Host">
        <InputName
          name="title"
          char="http://"
          value={""}
          placeholder={"test"}
          onChange={() => null}
          // onBlur={onDataCache}
        />
      </InputTemplate>

      <InputTemplate
        labelClassName="font-weight-bold ml-2"
        label={[
          "Path ",
          <FontAwesomeIcon icon={minimized ? faChevronDown : faChevronRight} />,
        ]}
        onClick={() => onMinimize(!minimized)}
      >
        <div
          className={`mx-3 border rounded py-2 ${minimized ? "" : "d-none"}`}
        >
          {paths.map((show, index) => (
            <div
              key={index}
              className={`mb-3 container w-100 ${styles["el-index"]}`}
            >
              <div className="row mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() => {
                    onPathChange([
                      ...paths.slice(0, index),
                      !paths[index],
                      ...paths.slice(index + 1),
                    ]);
                  }}
                >
                  {`[${index}] `}
                  <FontAwesomeIcon
                    icon={show ? faChevronDown : faChevronRight}
                  />
                </label>
                <FontAwesomeIcon
                  className={`mr-1 ${styles["el-container"]} text-danger`}
                  icon={faTrashAlt}
                  size="lg"
                  fontSize="1rem"
                  onClick={() => {
                    onPathChange([
                      ...paths.slice(0, index),
                      ...paths.slice(index + 1),
                    ]);
                  }}
                />
              </div>
              <Path show={show} />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => onPathChange([...paths, true])}
            >
              <FontAwesomeIcon
                className={`text-success ${styles["icon"]}`}
                icon={faPlus}
              />
            </a>
          </div>
        </div>
      </InputTemplate>
    </div>
  );
});
