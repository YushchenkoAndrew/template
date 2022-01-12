import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { K3sContainer } from "../../../config/placeholder";
import { Event } from "../../../pages/admin/projects/operation";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import Container from "./Container";
import styles from "./Deployment.module.css";

export interface DeploymentProps {
  show?: boolean;
  value: { [name: string]: any };
  onChange: (value: { [name: string]: any }) => void;
}

export interface DeploymentRef {}

export default React.forwardRef((props: DeploymentProps, ref) => {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    containers: true,
  });

  const [containers, onContainerChange] = useState([true]);

  function onChange(event: Event) {
    const keys = event.target.name.split(".");
    const name = keys.slice(-1)[0];
    let obj = props.value;
    keys.slice(0, -1).reduce((acc, curr) => acc[curr], obj)[name] =
      event.target.value;
    console.log(obj);

    props.onChange(obj);
  }

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
              name="metadata.name"
              required
              value={props.value.metadata.name ?? ""}
              placeholder="deployment"
              onChange={onChange}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate className="col-6" label="Namespace">
            <div className="input-group">
              <InputValue
                name="metadata.namespace"
                className="rounded"
                value={props.value.metadata.namespace ?? ""}
                placeholder="namespace"
                onChange={onChange}
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
          className={`row border rounded mx-1 py-2 ${
            minimized.spec ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6" label="Replicas">
            <div className="input-group">
              <InputName
                char="$"
                name="spec.replicas"
                required
                value={props.value.spec.replicas ?? "1"}
                placeholder={"1"}
                onChange={onChange}
                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>

          <InputTemplate className="col-6" label="Strategy">
            <InputRadio
              name="spec.strategy"
              placeholder={"RollingUpdate"}
              className="btn-group btn-group-sm btn-group-toggle"
              options={["RollingUpdate", "Recreate"]}
              label="btn-outline-info"
              onChange={onChange}
            />
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        labelClassName="font-weight-bold ml-2"
        label={[
          "Containers ",
          <FontAwesomeIcon
            icon={minimized.containers ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, containers: !minimized.containers })
        }
      >
        <div
          className={`container border rounded py-2 ${
            minimized.containers ? "" : "d-none"
          }`}
        >
          {containers.map((show, index) => (
            <div key={index} className={`mb-3 w-100 ${styles["el-index"]}`}>
              <div className="row mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() => {
                    onContainerChange([
                      ...containers.slice(0, index),
                      !containers[index],
                      ...containers.slice(index + 1),
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
                    onContainerChange([
                      ...containers.slice(0, index),
                      ...containers.slice(index + 1),
                    ]);
                  }}
                />
              </div>
              <Container
                show={show}
                offset={`spec.spec.containers.${index}`}
                value={props.value.spec.spec.containers[index]}
                onChange={onChange}
              />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => {
                onContainerChange([...containers, true]);

                // FIXME: ARE U SURE ABOUT THAT ???
                props.value.spec.spec.containers.push(K3sContainer);
                props.onChange(props.value);
              }}
            >
              <FontAwesomeIcon className={styles["icon"]} icon={faPlus} />
            </a>
          </div>
        </div>
      </InputTemplate>
    </div>
  );
});
