import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Deployment, Spec, Status } from "../../../types/K3s/Deployment";
import { Metadata } from "../../../types/K3s/Metadata";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import Container, { ContainerRef } from "./Container";
import styles from "./Default.module.css";

export interface DeploymentProps {
  show?: boolean;
}
export interface DeploymentRef {
  getValue: () => Deployment;
}

export default React.forwardRef((props: DeploymentProps, ref) => {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    matchLabels: true,
    containers: true,
  });

  const [deployment, onDeploymentChange] = useState<Deployment>({
    apiVersion: "app/v1",
    kind: "Deployment",
    metadata: {},
    spec: {
      selector: { matchLabels: {} },
      template: {
        metadata: {},
        spec: {
          containers: [],
        },
      },
    },
  });

  const [containers, onContainerChange] = useState<boolean[]>([]);
  const [containersRef, onContainerRefChange] = useState<
    React.RefObject<ContainerRef>[]
  >([]);

  useEffect(() => {
    onContainerRefChange(
      containers.map((_, i) => containersRef[i] || createRef<ContainerRef>())
    );
  }, [containers.length]);

  let [labels, onLabelsChange] = useState({} as { [key: string]: string });

  useImperativeHandle<unknown, DeploymentRef>(ref, () => ({
    getValue() {
      return {
        ...deployment,
        spec: {
          ...deployment.spec,
          replicas: Number(deployment.spec?.replicas ?? 1),
          selector: { matchLabels: { ...labels } },
          template: {
            ...deployment.spec?.template,
            metadata: {
              ...deployment.spec?.template?.metadata,
              labels: { ...labels },
            },
            spec: {
              ...deployment.spec?.template?.spec,
              containers: containersRef.map((item) => item.current?.getValue()),
            },
          },
        },
      } as Deployment;
    },
  }));

  return (
    <div className={`card px-1 py-3 ${props.show ? "" : "d-none"}`}>
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
              value={deployment.metadata?.name ?? ""}
              placeholder="void-deployment"
              onChange={({ target: { name, value } }) => {
                onDeploymentChange({
                  ...deployment,
                  metadata: {
                    ...deployment.metadata,
                    [name]: value,
                  },
                });
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate className="col-6" label="Namespace">
            <div className="input-group">
              <InputValue
                name="namespace"
                className="rounded"
                value={deployment.metadata?.namespace ?? ""}
                placeholder="demo"
                onChange={({ target: { name, value } }) => {
                  onDeploymentChange({
                    ...deployment,
                    metadata: {
                      ...deployment.metadata,
                      [name]: value,
                    },
                  });
                }}
                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mt-1"
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
          className={`border rounded mx-1 px-2 py-2 ${
            minimized.spec ? "" : "d-none"
          }`}
        >
          <div className="row">
            <InputTemplate className="col-6" label="Replicas">
              <div className="input-group">
                <InputName
                  char="$"
                  name="replicas"
                  required
                  value={`${deployment.spec?.replicas ?? ""}`}
                  placeholder="1"
                  onChange={({ target: { name, value } }) => {
                    onDeploymentChange({
                      ...deployment,
                      spec: {
                        ...deployment.spec,
                        [name]: value,
                      } as Spec,
                    });
                  }}
                  // onBlur={onDataCache}
                />
              </div>
            </InputTemplate>

            <InputTemplate className="col-6" label="Strategy">
              <InputRadio
                name="strategy"
                placeholder="RollingUpdate"
                className="btn-group btn-group-sm btn-group-toggle"
                options={["RollingUpdate", "Recreate"]}
                label="btn-outline-info"
                overflow={{
                  on: { className: "d-block d-sm-none", len: 6 },
                  off: { className: "d-none d-sm-block", len: 0 },
                }}
                onChange={({ target: { name, value } }) => {
                  onDeploymentChange({
                    ...deployment,
                    spec: {
                      ...deployment.spec,
                      strategy: { type: value },
                    } as Spec,
                  });
                }}
              />
            </InputTemplate>
          </div>

          <InputTemplate
            className="mt-1"
            label={[
              "MatchLabels ",
              <FontAwesomeIcon
                icon={minimized.matchLabels ? faChevronDown : faChevronRight}
              />,
            ]}
            onClick={() =>
              onMinimize({
                ...minimized,
                matchLabels: !minimized.matchLabels,
              })
            }
          >
            <div
              className={`border rounded px-2 py-2 ${
                minimized.matchLabels ? "" : "d-none"
              }`}
            >
              <div className="container px-2">
                <InputList
                  char={["var", "="]}
                  name={["name", "value"]}
                  placeholder={["app", "void"]}
                  onChange={(data) => {
                    if (!data["name"] || data["value"] === undefined) {
                      return false;
                    }
                    onLabelsChange({
                      ...labels,
                      [data["name"]]: data["value"],
                    });
                    return true;
                  }}
                />
                <ul className="list-group">
                  {Object.entries(labels).map(([name, value], i) => (
                    <div key={`matchLabels-${i}`} className="row">
                      <ListEntity
                        char={["var", "="]}
                        value={[name, value]}
                        onChange={() => {
                          let temp = { ...labels };
                          delete temp[name];
                          onLabelsChange(temp);
                        }}
                      />
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mt-1"
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
          className={`border rounded px-1 py-2 mx-1 ${
            minimized.containers ? "" : "d-none"
          }`}
        >
          {containers.map((show, index) => (
            <div
              key={`container-${index}`}
              className={`mb-3 w-100 ${styles["el-index"]}`}
            >
              <div className="row mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() => {
                    onContainerChange({
                      ...containers,
                      [index]: !containers[index],
                    });
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
              <Container ref={containersRef[index]} show={show} />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => onContainerChange([...containers, true])}
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
