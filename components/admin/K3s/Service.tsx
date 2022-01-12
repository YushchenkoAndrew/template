import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import Container from "./Container";
import styles from "./Deployment.module.css";
import Port from "./Port";

export interface ServiceProps {
  show?: boolean;
}

export interface ServiceRef {}

export default React.forwardRef((props: ServiceProps, ref) => {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    ports: true,
  });

  const [ports, onPortChange] = useState([true]);

  return (
    <div
      className={`card col-12 col-md-8 col-lg-5 p-3 m-3 ${
        props.show ? "" : "d-none"
      }`}
    >
      <InputTemplate
        labelClassName="font-weight-bold ml-2"
        label={[
          "Metadata ",
          <FontAwesomeIcon
            icon={minimized.metadata ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, metadata: !minimized.metadata })
        }
      >
        <div
          className={`row border rounded mx-1 py-2 ${
            minimized.metadata ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6" label="Name">
            <InputName
              char="@"
              name="name"
              required
              value={""}
              placeholder={"Test"}
              onChange={(event) => {
                event.target.value = event.target.value.replace(" ", "");
                // onThumbnailChange(event);
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate className="col-6" label="Namespace">
            <div className="input-group">
              <InputValue
                name="title"
                className="rounded"
                value={""}
                placeholder={"test"}
                onChange={() => null}
                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        labelClassName="font-weight-bold ml-2"
        label={[
          "Spec ",
          <FontAwesomeIcon
            icon={minimized.spec ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, spec: !minimized.spec })}
      >
        <div
          className={`border rounded mx-1 py-2 ${
            minimized.spec ? "" : "d-none"
          }`}
        >
          <InputTemplate className="mx-3" label="Cluster IP">
            <InputName
              char="$"
              name="name"
              required
              value={""}
              placeholder={"10.0.171.239"}
              onChange={(event) => {
                event.target.value = event.target.value.replace(" ", "");
                // onThumbnailChange(event);
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate className="mx-3" label="Type">
            <InputRadio
              name="flag"
              placeholder={"ClusterIP"}
              className="btn-group btn-group-sm btn-group-toggle"
              options={[
                "ClusterIP",
                "NodePort",
                "LoadBalancer",
                "ExternalName",
              ]}
              label="btn-outline-info"
              onChange={(event) => {}}
            />
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        labelClassName="font-weight-bold ml-2"
        label={[
          "Ports ",
          <FontAwesomeIcon
            icon={minimized.ports ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, ports: !minimized.ports })}
      >
        <div
          className={`container border rounded py-2 ${
            minimized.ports ? "" : "d-none"
          }`}
        >
          {ports.map((show, index) => (
            <div key={index} className={`mb-3 w-100 ${styles["el-index"]}`}>
              <div className="row mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() => {
                    onPortChange([
                      ...ports.slice(0, index),
                      !ports[index],
                      ...ports.slice(index + 1),
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
                    onPortChange([
                      ...ports.slice(0, index),
                      ...ports.slice(index + 1),
                    ]);
                  }}
                />
              </div>
              <Port show={show} />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => onPortChange([...ports, true])}
            >
              <FontAwesomeIcon className={styles["icon"]} icon={faPlus} />
            </a>
          </div>
        </div>
      </InputTemplate>
    </div>
  );
});
